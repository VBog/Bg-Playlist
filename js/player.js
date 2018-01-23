jQuery(document).ready(function(){
/*** НАЧАЛО: Внедряем кнопку загрузки трека ***/
	jQuery('div.wp-playlist-item').ready(function () {
		if (bg_playlist.download) {
			jQuery('div.wp-playlist-item').each(function () {
				the_link = jQuery(this).children('a').prop('href');
				jQuery(this).after('<div class="wp-playlist-item-download"><input type="button" onclick="location.href=\''+the_link+'\'" title="Скачать трек" /></div><div></div>');
			});
		} else jQuery('.wp-playlist-item').css('width', '100%');
		if (!bg_playlist.header) jQuery('div.wp-playlist-current-item').hide();
		
	});
/*** КОНЕЦ: Внедряем кнопку загрузки трека ***/
});
