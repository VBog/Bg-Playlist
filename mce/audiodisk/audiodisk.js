(function() {
    tinymce.PluginManager.add('bg_playlist_insert_audiodisk', function( editor, url ) {
        editor.addButton( 'bg_playlist_insert_audiodisk', {
			title: bg_playlist.btn_audiodisk,
			image: url + "/img/audiodisk.png",
			onclick: function() {
			if (tinyMCE.activeEditor.selection.getNode().nodeName == 'A')  
				var content = tinyMCE.activeEditor.selection.getNode().parentElement.innerHTML;
			else
				var content = tinyMCE.activeEditor.selection.getContent();
				content = '[audiodisk]' + content + '[/audiodisk]';
				editor.insertContent(content);
			}
        });
    });
})();
