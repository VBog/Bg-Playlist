jQuery(document).ready(function(){
	jQuery('div.wp-playlist-item').ready(function () {
	
		bg_tooltip();	// Всплывающая подсказка с названием трека
	
/*** НАЧАЛО: Определяем продолжительность трека, если не задано ***/
		if (bg_playlist.get_duration) {
			jQuery('div.wp-playlist-item').each(function () {
			var el = jQuery(this);
				if (el.children('div.wp-playlist-item-length').length > 0) return;
			var aud = new Audio();
				the_link = el.children('a').prop('href');
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
		if (bg_playlist.download) {
			jQuery('div.wp-playlist-item').each(function () {
				the_link = jQuery(this).children('a').prop('href');
				jQuery(this).after('<div class="wp-playlist-item-download"><input type="button" onclick="location.href=\''+the_link+'\'" title="Скачать трек" /></div><div></div>');
			});
		} else jQuery('.wp-playlist-item').css('width', '100%');
/*** КОНЕЦ: Внедряем кнопку загрузки трека ***/

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
	
//    var targets = jQuery( '[rel~=tooltip]' ),
    var targets = jQuery( 'a.wp-playlist-caption' ),
        target  = false,
        tooltip = false,
        title   = false;
        target_win  = jQuery( 'div.wp-playlist:first' );

    targets.bind( 'mouseenter', function() {
        target  = jQuery( this );
		if (this.scrollWidth-this.clientWidth <= 0) return;	// Только если текст не умещается в блоке
		
		target.attr('title', jQuery(this).text().replace(/\s{2,}/g, ' '));
        tip     = target.attr( 'title' );
        tooltip = jQuery( '<div id="tooltip"></div>' );

        if( !tip || tip == '' )
            return false;

        target.removeAttr( 'title' );
        tooltip.css( 'opacity', 0 )
               .html( tip )
               .appendTo( 'body' );

        var init_tooltip = function()
        {
			tooltip.css( 'max-width', 480 );
			tooltip.css( 'width', jQuery( window ).width() - 10);

            var pos_left = target_win.offset().left + ( target_win.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                pos_top  = target.offset().top - tooltip.outerHeight() - 10;

            if( pos_left < 0 ) {
                pos_left = target_win.offset().left + target_win.outerWidth() / 2 - 20;
                tooltip.addClass( 'left' );
            } else tooltip.removeClass( 'left' );

            if( pos_left + tooltip.outerWidth() > jQuery( window ).width() ) {
                pos_left = target_win.offset().left - tooltip.outerWidth() + target_win.outerWidth() / 2 + 20;
                tooltip.addClass( 'right' );
            } else tooltip.removeClass( 'right' );

            if( pos_top < 0 ) {
                var pos_top  = target.offset().top + target.outerHeight();
                tooltip.addClass( 'top' );
            }
            else tooltip.removeClass( 'top' );

            tooltip.css( { left: pos_left, top: pos_top } )
                   .animate( { top: '+=10', opacity: 1 }, 250 );
        };

        init_tooltip();

        var remove_tooltip = function() {
            tooltip.animate( { top: '-=10', opacity: 0 }, 250, function() {
                jQuery( this ).remove();
            });

            target.attr( 'title', tip );
			clearTimeout(timerId);
        };
        target.bind( 'mouseleave', remove_tooltip );
        tooltip.bind( 'click', remove_tooltip );
		timerId = setTimeout(remove_tooltip, 7000);
		
    });
}
/*** КОНЕЦ: Всплывающая подсказка для ссылок ***/