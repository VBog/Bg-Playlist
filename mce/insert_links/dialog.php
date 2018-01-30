<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Insert audiolink</title>
	<script type="text/javascript" src="/wp-includes/js/jquery/jquery.js"></script>
	<script type="text/javascript" src="/wp-includes/js/tinymce/tiny_mce_popup.js"></script>
</head>

<style type="text/css">
    fieldset{
        margin: 5px 0px 10px 0px;
        padding: 5px;
        overflow: hidden;
	    font-size: 14px;
    }
    fieldset label{
        margin-right:5px;
	    font-size: 12px;
    }

    fieldset input[type="text"] {
        width: 100%;
        margin:5px 0px;
	    font-size: 12px;
	}
    fieldset input[type="number"] {
        margin:5px 0px;
	    font-size: 12px;
	}
 </style>
    
<body>
 <script type="text/javascript">
jQuery(document).ready(function(){
	// Забераем опции из родительского окна
	bg_option = window.parent.window.bg_playlist;
	// Класс аудиоссылки 
	jQuery("input#class").val(bg_option.audioclass);

	// Займемся локализацией
	jQuery(document).attr("title", bg_option.title);
	jQuery("legend#legend1").html(bg_option.legend1);
	jQuery("legend#legend2").html(bg_option.legend2);
	
	// Все label
	jQuery("form#bg-links").find("label").each(function(){
		att_name = jQuery(this).attr("id");
		if (bg_option[att_name])
			jQuery(this).html(bg_option[att_name]);
	});
	jQuery("input#insert").val(bg_option.insert);
	jQuery("input#cancel").val(bg_option.cancel);

	// Обработка нажатия кнопки insert
	jQuery("#insert").click(function(){
		
		var image = '<img ';
		jQuery("div#bg-container2").find("input").each(function(){
		var att_name = jQuery(this).attr("id").trim(),
			att_value = jQuery(this).val().trim(),
			att_result = att_name + '="' + att_value + '" ';

			if (att_value) image += att_result;
		});

		image += '/>';
		if(!(image.indexOf('src=') + 1)) image = "";
		
		var tag = '<a ';
		jQuery("div#bg-container1").find("input").each(function(){
		var att_name = jQuery(this).attr("id").trim(),
			att_value = jQuery(this).val().trim(),
			att_result = att_name + '="' + att_value + '" ';

			if (att_name == 'text') link_text = att_value;
			else if (att_value) tag += att_result;
		});

		tag = tag.slice(0, -1);
		tag += '>' + image + link_text + '</a>';

		tinyMCEPopup.editor.execCommand('mceInsertContent', false,  tag);
		tinyMCEPopup.close();
	});

	// Обработка нажатия кнопки cancel
	jQuery("#cancel").click(function(){
		tinyMCEPopup.close();
	});
	
	var aud = new Audio();
	jQuery('input#href').change (function(){
		jQuery('input#data-length').val('');
		aud.src = jQuery('input#href').val();
		if (aud.src) {
			aud.addEventListener('loadedmetadata', function() {
				time = Math.round(aud.duration);
				jQuery('input#data-length').val(time);
			});	
		}
	});
})
 </script>
  
<form id="bg-links" method="" action="">
    <div id="bg-container1">
        <fieldset>
            <legend id="legend1">Audiolink attrebutes</legend>
            <label id="l_class">class</label><input type="text" id="class" value="wpaudio" style="width: 50%" /><br/>
            <label id="l_href">href</label><input type="text" id="href" /><br/>
            <label id="l_title">title</label><input type="text" id="title" /><br/>
            <label id="l_alt">alt</label><input type="text" id="alt" /><br/>
            <label id="l_data-artist">data-artist</label><input type="text" id="data-artist" /><br/>
            <label id="l_data-album">data-album</label><input type="text" id="data-album" /><br/>
            <label id="l_data-length">data-length</label><br/><input type="number" id="data-length" min="-1" /><br/>

            <label id="l_text">Link text</label><input type="text" id="text" /><br/>
        </fieldset>
    </div>
    <div id="bg-container2">
        <fieldset>
            <legend id="legend2">Image attributes</legend>
            <label id="l_src">src</label><input type="text" id="src" /><br/>
            <label id="l_width">width</label><input type="text" id="width" style="width: 35%" />
            <label id="l_height">height</label><input type="text" id="height" style="width: 35%" />
    </div>
    
    <div style="float: right;">
        <input type="button" id="insert" name="insert" value="Insert" />
        <input type="button" id="cancel" name="cancel" value="Cancel" />
    </div>
</form>

</body>
</html>
