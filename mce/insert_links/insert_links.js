(function(){
    tinymce.create("tinymce.plugins.bgInsertLinks",{
        init:function(a, b){
            a.addCommand("bg_tagInsert", function(){
                a.windowManager.open({
                    file: b + "/dialog.php",
                    width: 420,
                    height: 560,
                    inline: 1
                })
            });
          
            a.addButton("bg_playlist_insert_links",{
                title: bg_playlist.btn_audiolink,
                cmd: "bg_tagInsert",
                image: b + "/img/link.gif"
            });
        },
    });
    
    tinymce.PluginManager.add("bg_playlist_insert_links",tinymce.plugins.bgInsertLinks)
})();

