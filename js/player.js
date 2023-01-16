jQuery(document).ready(function(){
	jQuery('div.wp-playlist').ready(function () {
	
		// Всплывающая подсказка с названием трека
		bg_tooltip();
		
		// Разрешаем html в caption
		jQuery('a.wp-playlist-caption').each(function () {
			caption = jQuery(this).html();
			caption = caption.replace(/&lt;/g, "<");
			caption = caption.replace(/&gt;/g, ">");
			jQuery(this).html(caption);
		});

/*** НАЧАЛО: Кнопка триггера Play/Pause ***/
		if (bg_playlist.play_pause) {
			jQuery(function () {
				var timerId;
				// Добавляем кнопку
				jQuery('div.wp-playlist:first').parent('div').append('<div id="wp-playlist-trigger"></div>');
				
				jQuery('div#wp-playlist-trigger').addClass('wp-playlist-trigger-play');
				jQuery('div#wp-playlist-trigger').attr('title', bg_playlist.title_play);
				// Определяем активный плеер
				var player = jQuery('.mejs-mediaelement audio').first(); // Сначала первый
				// Воспроизведение
				jQuery('.mejs-mediaelement audio').on ('play', function () {
					player = jQuery(this);
					// Меняем изображение кнопки
					jQuery('div#wp-playlist-trigger').addClass('wp-playlist-trigger-pause');
					jQuery('div#wp-playlist-trigger').removeClass('wp-playlist-trigger-play');
					jQuery('div#wp-playlist-trigger').attr('title', bg_playlist.title_pause);
					jQuery('body').append('<div class="wait_pls"></div>');
					
					timerId = setInterval(function() {
						if (player[0].readyState > 0) {
							if (player[0].duration != Infinity) {
								// Добавляем кнопки prev и next
								jQuery('div.wp-playlist:first').parent('div').append('<div id="wp-playlist-next"></div>');
								jQuery('div#wp-playlist-next').attr('title', bg_playlist.title_next);
								jQuery('div#wp-playlist-next').on ('click', function () {
									var time = player[0].getCurrentTime();	// Получим текущее время трека
									 time = time + parseInt(bg_playlist.step);
									player[0].setCurrentTime (time);		// Установим время запуска трека
								});

								jQuery('div.wp-playlist:first').parent('div').append('<div id="wp-playlist-prev"></div>');
								jQuery('div#wp-playlist-prev').attr('title', bg_playlist.title_prev);
								jQuery('div#wp-playlist-prev').on ('click', function () {
									var time = player[0].getCurrentTime();	// Получим текущее время трека
									 time = time - parseInt(bg_playlist.step);
									player[0].setCurrentTime (time);		// Установим время запуска трека
								});
							}
							clearInterval(timerId);
							jQuery('div.wait_pls').remove();
						}
					}, 100);
					
				});
				// Пауза
				jQuery('.mejs-mediaelement audio').on ('pause', function () {
					if (player[0].id == jQuery(this)[0].id) {
						// Меняем изображение кнопки
						jQuery('div#wp-playlist-trigger').addClass('wp-playlist-trigger-play');
						jQuery('div#wp-playlist-trigger').removeClass('wp-playlist-trigger-pause');
						jQuery('div#wp-playlist-trigger').attr('title', bg_playlist.title_play);
						
						// Удаляем кнопки prev и next
						jQuery('div#wp-playlist-next').remove();
						jQuery('div#wp-playlist-prev').remove();
						if (timerId) {
							clearInterval(timerId);
							jQuery('div.wait_pls').remove();
						}
					}
				});
				// Нажали на кнопку
				jQuery('div#wp-playlist-trigger').on ('click', function () {
					var mejs = player.parents('div.wp-playlist');
					var src = mejs.find('.wp-playlist-playing a').attr('href');
					if (src != player[0].src){
						player[0].src = src;
					}
					if(player[0].paused) {
						player[0].play();
					} else {
						player[0].pause();
					}
				});
				// Нажали на трек
				jQuery('a.wp-playlist-caption').on ('click', function () {
					var src = jQuery(this).attr('href');
					if (src != player[0].src){
						player[0].src = src;
					}
				});
			});
		}
/*** КОНЕЦ: Кнопка триггера Play/Pause ***/

/*** НАЧАЛО: Определяем продолжительность трека, если не задано ***/
		if (bg_playlist.get_duration) {
			jQuery('div.wp-playlist-item').each(function () {
			var el = jQuery(this);
				if (el.children('div.wp-playlist-item-length').length > 0) return;
				var aud = new Audio();
				var the_link = el.children('a').prop('href');
				aud.src = the_link;
				aud.addEventListener('loadedmetadata', function() {
					sec = Math.round(aud.duration);
					min = Math.floor(sec / 60);
					sec = sec - min*60;
					time = ((min<10)?('0'+min):min)+':'+((sec<10)?('0'+sec):sec);
					el.append('<div class="wp-playlist-item-length">'+time+'</div>');
				});	
			});
		}
/*** КОНЕЦ: Определяем продолжительность трека, если не задано ***/
	
/*** НАЧАЛО: Внедряем кнопку загрузки трека ***/
		if (bg_playlist.download && !is_iOs()) {
			jQuery('div.wp-playlist-item').each(function () {
				var el = jQuery(this);
				el.addClass('wp-playlist-item-inline');
				var the_link = el.children('a').prop('href');
//				the_link = the_link.replace('https://azbyka.ru', '');
				var the_ext = the_link.split('.').pop();
				var the_title =  el.children('a').children('span.wp-playlist-item-title').text().trim();				
				if (el.children('div.wp-playlist-item-length').length > 0) {
					el.after('<div class="wp-playlist-item-download"><a href="'+the_link+'" download="'+the_title+'.'+the_ext+'"><input type="button" title="Скачать трек" /></a></div>');
				} else {
					el.after('<div class="wp-playlist-item-blank"></div>');
				}
			});
		}
/*** КОНЕЦ: Внедряем кнопку загрузки трека ***/

/*** НАЧАЛО: Меняем ссылку m3u для iOs ***/
		if (is_iOs()) {
			var i = 0;
			jQuery('div.bg_download_m3u').each(function () {
				var el = jQuery(this).children('a');
				var the_link = el.prop('href');
				el.removeAttr('href');
				el.removeAttr('download');
				el.removeAttr('title');
				el.css('cursor','pointer')
				el.click( function () {
					iosCopyToClipboard(the_link, this);
					bg_message(bg_playlist.already_copied+"<br>"+the_link, jQuery(this));
				});
				el.text(bg_playlist.url_to_clipboard);
				i++;
			});
		}
/*** КОНЕЦ: Меняем ссылку m3u для iOs ***/

/*** НАЧАЛО: Скрыть шапку плейера ***/
		if (!bg_playlist.header) jQuery('div.wp-playlist-current-item').hide();
/*** КОНЕЦ: Скрыть шапку плейера ***/
	});

/*** НАЧАЛО: Хак - прерываем бесконечный цикл прокрутки плейлиста ***/
	if (bg_playlist.noloop) {
		jQuery(function () {
			// Ожидаем событие окончания проигрывания трека
			jQuery('.mejs-mediaelement audio').on('ended', function (e) {
				// Найдем первый элемент в списке плейлиста, 
				// которому принадлежит проигрыватель (mejs-mediaelement audio) 
				first_item = jQuery(this).closest("div.wp-playlist").find('.wp-playlist-item').first();
				// Если первый элемент должен сейчас начать проигрываться (содержит класс wp-playlist-playing), 
				// то есть завершился последний, то останавливаем плеер
				if(first_item.hasClass('wp-playlist-playing')) {
					// Дождемся завершения загрузки трека, которая уже выполняется асинхронно 
					jQuery(this).on('loadeddata.noloop', function () {
						e.preventDefault();				// Предотвратить стандартное действие
						jQuery(this)[0].player.pause();	// Останавливаем плеер
						jQuery(this).off('loadeddata.noloop');	// Отменяем текущее событие - оно нам больше не нужно
					});
				}
			});
		});
	}
/*** КОНЕЦ: Хак - прерываем бесконечный цикл прокрутки плейлиста ***/
});

/*** НАЧАЛО: Всплывающая подсказка для ссылок ***/
function bg_tooltip() {
	
    var targets = jQuery( 'a.wp-playlist-caption' );
    var target_win  = jQuery( 'div.wp-playlist:first' );

    targets.bind( 'mouseenter touchmove', function() {
        var target  = jQuery( this );
		
		jQuery('div#tooltip').each(function(ind, el){
			el.remove();
		});
		if (this.scrollWidth-this.clientWidth <= 0) return false;	// Только если текст не умещается в блоке
		
		target.attr('title', target.text().replace(/\s{2,}/g, ' '));
        var tip = target.attr( 'title' );
        if( !tip || tip == '' ) return false;

        var tooltip = jQuery( '<div id="tooltip"></div>' );
        target.removeAttr( 'title' );
        tooltip.css( 'opacity', 0 )
               .html( tip )
               .appendTo( 'body' );

		tooltip.css( 'max-width', 480 );
		tooltip.css( 'width', jQuery( window ).width() - 10);

		var pos_left = target_win.offset().left + ( target_win.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 );
		var pos_top  = target.offset().top - tooltip.outerHeight() - 10;

		if( pos_left < 0 ) {
			pos_left = target_win.offset().left + target_win.outerWidth() / 2 - 20;
			tooltip.addClass( 'left' );
		} else tooltip.removeClass( 'left' );

		if( pos_left + tooltip.outerWidth() > jQuery( window ).width() ) {
			pos_left = target_win.offset().left - tooltip.outerWidth() + target_win.outerWidth() / 2 + 20;
			tooltip.addClass( 'right' );
		} else tooltip.removeClass( 'right' );

		if( pos_top < 0 ) {
			pos_top  = target.offset().top + target.outerHeight();
			tooltip.addClass( 'top' );
		}
		else tooltip.removeClass( 'top' );

		tooltip.css( { left: pos_left, top: pos_top } )
			   .animate( { top: '+=10', opacity: 1 }, 250 );

        var remove_tooltip = function() {
            tooltip.animate( { top: '-=10', opacity: 0 }, 250, function() {
                jQuery( this ).remove();
            });
            target.attr( 'title', tip );
			clearTimeout(timerId);
        };
        target.bind( 'mouseleave', remove_tooltip );
		timerId = setTimeout(remove_tooltip, 3000);
		
    });
}
/*** КОНЕЦ: Всплывающая подсказка для ссылок ***/

/*** НАЧАЛО: Проверка, является ли система iOs ***/
function is_iOs ()	{
	var u	= navigator.userAgent;
	return u.indexOf("iPhone") > -1 || u.indexOf("iPod") > -1 || u.indexOf("iPad") > -1;	
}
/*** КОНЕЦ: Проверка, является ли система iOs ***/

/*** НАЧАЛО: Копирование в буфер обмена ***/
function iosCopyToClipboard(href, e) {
    var input = document.createElement("input");
//    document.body.appendChild(input);
    e.appendChild(input);
    input.setAttribute('value', href);

	var editable = input.contentEditable;
	var readOnly = input.readOnly;

	input.contentEditable = true;
	input.readOnly = false;

	var range = document.createRange();
	range.selectNodeContents(input);

	var selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);

	input.setSelectionRange(0, 999999);
    document.execCommand('copy');
	
	input.contentEditable = editable;
	input.readOnly = readOnly;

//    document.body.removeChild(input);
    e.removeChild(input);
}
/*** КОНЕЦ: Копирование в буфер обмена ***/

function bg_message(text, el) {
	var msg = jQuery( '<div class="message"></div>' );
	msg.css('opacity', 0).html(text).appendTo('body');

	var pos_top  = el.offset().top - msg.outerHeight() - 10;
	msg.css( { top: pos_top } )
		   .animate( { top: '+=10', opacity: 1 }, 250 );

	var remove_msg = function() {
		msg.remove();
		clearTimeout(timerId);
	};
	timerId = setTimeout(remove_msg, 3000);

}