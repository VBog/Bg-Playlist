(function() {
    tinymce.PluginManager.add('bg_playlist_insert_playlist', function( editor, url ) {
        editor.addButton( 'bg_playlist_insert_playlist', {
			title: bg_playlist.btn_playlist,
			image: url + "/img/playlist.png",
			onclick: function() {
				// Open window
				editor.windowManager.open({
					title: bg_playlist.ttl_playlist,
					body: [
					  {type: 'textbox', name: 'src', style: 'width:450px'}
					],
					onsubmit: function(e) {
						// Insert content when the window form is submitted
						editor.insertContent('[audiodisk src="'+e.data.src+'" /]');
					}
				});
			}
        });
    });
})();
