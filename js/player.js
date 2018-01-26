jQuery(document).ready(function(){
	jQuery('div.wp-playlist-item').ready(function () {
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
