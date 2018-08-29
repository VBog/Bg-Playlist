<?php
/*********************************************************************
	Страница настроек плагина
	
**********************************************************************/
add_action('admin_menu', 'bg_playlist_add_plugin_page');
function bg_playlist_add_plugin_page(){
	add_options_page( __('Bg Playlist settings','bg-playlist'), __('Playlist','bg-playlist'), 'manage_options', 'bg_playlist_slug', 'bg_playlist_options_page_output' );
}

function bg_playlist_options_page_output(){
	?>
	<div class="wrap">
		<h2><?php echo get_admin_page_title() ?></h2>

        <?php $active_tab = isset( $_GET[ 'tab' ] ) ? $_GET[ 'tab' ] : 'general_options'; ?>
         
        <h2 class="nav-tab-wrapper">
            <a href="?page=bg_playlist_slug&tab=general_options" class="nav-tab <?php echo $active_tab == 'general_options' ? 'nav-tab-active' : ''; ?>"><?php _e('General','bg-playlist'); ?></a>
            <a href="?page=bg_playlist_slug&tab=display_options" class="nav-tab <?php echo $active_tab == 'display_options' ? 'nav-tab-active' : ''; ?>"><?php _e('View','bg-playlist'); ?></a>
        </h2>
		
		<form action="options.php" method="POST">
			<?php
				if( $active_tab == 'general_options' ) {
					settings_fields( 'bg_playlist_option_group1' );     // скрытые защитные поля
					do_settings_sections( 'bg_playlist_page1' ); 		// секции с настройками (опциями). 
					submit_button();
				} else {
					settings_fields( 'bg_playlist_option_group2' );    	// скрытые защитные поля
					do_settings_sections( 'bg_playlist_page2' ); 		// секции с настройками (опциями). 
					submit_button();
				}
			?>
		</form>
	</div>
	<?php
}

/**
 * Регистрируем настройки.
 * Настройки будут храниться в массиве, а не одна настройка = одна опция.
 */
add_action('admin_init', 'bg_playlist_plugin_settings');
function bg_playlist_plugin_settings(){
	$val = bg_playlist_get_option();
	
	// параметры: $option_group, $option_name, $sanitize_callback
	register_setting( 'bg_playlist_option_group1', 'bg_playlist_options1', 'bg_playlist_sanitize_callback' );

	// параметры: $id, $title, $callback, $page
	add_settings_section( 'section_id', __('General settings','bg-playlist'), '', 'bg_playlist_page1' ); 

	// параметры: $id, $title, $callback, $page, $section, $args
	add_settings_field('bg_playlist_field1', __('Create a playlist using audio links on the page automatically','bg-playlist'), 'fill_bg_playlist_field1', 'bg_playlist_page1', 'section_id' );
	add_settings_field('bg_playlist_field2', __('Audiolink class','bg-playlist'), 'fill_bg_playlist_field2', 'bg_playlist_page1', 'section_id' );
	add_settings_field('bg_playlist_field3', __('Preload audiofile','bg-playlist'), 'fill_bg_playlist_field3', 'bg_playlist_page1', 'section_id' );
	add_settings_field('bg_playlist_field4', __('Disable playlist looping','bg-playlist'), 'fill_bg_playlist_field4', 'bg_playlist_page1', 'section_id' );
	add_settings_field('bg_playlist_field5', __('Get duration from audiofile','bg-playlist'), 'fill_bg_playlist_field5', 'bg_playlist_page1', 'section_id' );

	// параметры: $option_group, $option_name, $sanitize_callback
	register_setting( 'bg_playlist_option_group2', 'bg_playlist_options2', 'bg_playlist_sanitize_callback' );
	
	// параметры: $id, $title, $callback, $page
	add_settings_section( 'section_id', __('Player appearance','bg-playlist'), '', 'bg_playlist_page2' ); 

	// параметры: $id, $title, $callback, $page, $section, $args
	add_settings_field('bg_playlist_field11', __('Show player header','bg-playlist'), 'fill_bg_playlist_field11', 'bg_playlist_page2', 'section_id' );
	add_settings_field('bg_playlist_field12', __('Show tracklist','bg-playlist'), 'fill_bg_playlist_field12', 'bg_playlist_page2', 'section_id' );
	add_settings_field('bg_playlist_field13', __('Show track numbers','bg-playlist'), 'fill_bg_playlist_field13', 'bg_playlist_page2', 'section_id' );
	add_settings_field('bg_playlist_field14', __('Show track trumb','bg-playlist'), 'fill_bg_playlist_field14', 'bg_playlist_page2', 'section_id' );
	add_settings_field('bg_playlist_field15', __('Show artists','bg-playlist'), 'fill_bg_playlist_field15', 'bg_playlist_page2', 'section_id' );
	add_settings_field('bg_playlist_field16', __('Show album name','bg-playlist'), 'fill_bg_playlist_field16', 'bg_playlist_page2', 'section_id' );
	add_settings_field('bg_playlist_field17', __('Show Download button','bg-playlist'), 'fill_bg_playlist_field17', 'bg_playlist_page2', 'section_id' );
	add_settings_field('bg_playlist_field27', __('Show Play/Pause button','bg-playlist'), 'fill_bg_playlist_field27', 'bg_playlist_page2', 'section_id' );
	add_settings_field('bg_playlist_field18', __('Style','bg-playlist'), 'fill_bg_playlist_field18', 'bg_playlist_page2', 'section_id' );
	add_settings_field('bg_playlist_field19', __('Skin','bg-playlist'), 'fill_bg_playlist_field19', 'bg_playlist_page2', 'section_id' );

}
## Заполняем опцию 1
function fill_bg_playlist_field1(){
	$val = get_option('bg_playlist_options1');
	$val = (!empty($val) && isset($val['autoplaylist'])) ? $val['autoplaylist'] : null;
	?>
	<label><input type="checkbox" name="bg_playlist_options1[autoplaylist]" value="1" <?php checked( 1, $val ) ?> /> </label>
	<?php
}

## Заполняем опцию 2
function fill_bg_playlist_field2(){
	$val = get_option('bg_playlist_options1');
	$val = (!empty($val) && isset($val['audioclass'])) ? $val['audioclass'] : '';
	?>
	<label><input type="text" name="bg_playlist_options1[audioclass]" value="<?php echo $val ?>"  /> </label>
	<?php
}
## Заполняем опцию 3
function fill_bg_playlist_field3(){
	$val = get_option('bg_playlist_options1');
	$val = (!empty($val) && isset($val['preload'])) ? $val['preload'] : 'none';
	?>
	<select name="bg_playlist_options1[preload]">
		<option <?php selected('none', $val); ?> value='none'><?php _e('Don\'t load','bg-playlist'); ?></option>
		<option <?php selected('metadata', $val); ?> value='metadata'><?php _e('Service information only','bg-playlist'); ?></option>
		<option <?php selected('auto', $val); ?> value='auto'><?php _e('All while loading the page','bg-playlist'); ?></option>
	</select>
	<?php
}
## Заполняем опцию 4
function fill_bg_playlist_field4(){
	$val = get_option('bg_playlist_options1');
	$val = (!empty($val) && isset($val['noloop'])) ? $val['noloop'] : null;
	?>
	<label><input type="checkbox" name="bg_playlist_options1[noloop]" value="1" <?php checked( 1, $val ) ?> /> </label>
	<?php
}
## Заполняем опцию 5
function fill_bg_playlist_field5(){
	$val = get_option('bg_playlist_options1');
	$val = (!empty($val) && isset($val['get_duration'])) ? $val['get_duration'] : null;
	?>
	<label><input type="checkbox" name="bg_playlist_options1[get_duration]" value="1" <?php checked( 1, $val ) ?> /> </label>
	<?php _e('(If the length of the track isn\'t set, try to get metadata from the audiofile).','bg-playlist');
}

###############################################################

## Заполняем опцию 11
function fill_bg_playlist_field11(){
	$val = get_option('bg_playlist_options2');
	$val = (!empty($val) && isset($val['show_header'])) ? $val['show_header'] : null;
	?>
	<label><input type="checkbox" name="bg_playlist_options2[show_header]" value="1" <?php checked( 1, $val ) ?> /> </label>
	<?php
}
## Заполняем опцию 12
function fill_bg_playlist_field12(){
	$val = get_option('bg_playlist_options2');
	$val = (!empty($val) && isset($val['show_list'])) ? $val['show_list'] : null;
	?>
	<label><input type="checkbox" name="bg_playlist_options2[show_list]" value="1" <?php checked( 1, $val ) ?> /> </label>
	<?php
}
## Заполняем опцию 13
function fill_bg_playlist_field13(){
	$val = get_option('bg_playlist_options2');
	$val = (!empty($val) && isset($val['show_numbers'])) ? $val['show_numbers'] : null;
	?>
	<label><input type="checkbox" name="bg_playlist_options2[show_numbers]" value="1" <?php checked( 1, $val ) ?> /> </label>
	<?php
}
## Заполняем опцию 14
function fill_bg_playlist_field14(){
	$val = get_option('bg_playlist_options2');
	$val = (!empty($val) && isset($val['show_image'])) ? $val['show_image'] : null;
	?>
	<label><input type="checkbox" name="bg_playlist_options2[show_image]" value="1" <?php checked( 1, $val ) ?> /> </label>
	<?php
}
## Заполняем опцию 15
function fill_bg_playlist_field15(){
	$val = get_option('bg_playlist_options2');
	$val = (!empty($val) && isset($val['show_artist'])) ? $val['show_artist'] : null;
	?>
	<label><input type="checkbox" name="bg_playlist_options2[show_artist]" value="1" <?php checked( 1, $val ) ?> /> </label>
	<?php
}
## Заполняем опцию 16
function fill_bg_playlist_field16(){
	$val = get_option('bg_playlist_options2');
	$val = (!empty($val) && isset($val['show_album'])) ? $val['show_album'] : null;
	?>
	<label><input type="checkbox" name="bg_playlist_options2[show_album]" value="1" <?php checked( 1, $val ) ?> /> </label>
	<?php
}
## Заполняем опцию 17
function fill_bg_playlist_field17(){
	$val = get_option('bg_playlist_options2');
	$val = (!empty($val) && isset($val['show_download'])) ? $val['show_download'] : null;
	?>
	<label><input type="checkbox" name="bg_playlist_options2[show_download]" value="1" <?php checked( 1, $val ) ?> /> </label>
	<?php
}
## Заполняем опцию 27
function fill_bg_playlist_field27(){
	$val = get_option('bg_playlist_options2');
	$val = (!empty($val) && isset($val['show_play_pause'])) ? $val['show_play_pause'] : null;
	?>
	<label><input type="checkbox" name="bg_playlist_options2[show_play_pause]" value="1" <?php checked( 1, $val ) ?> /> </label>
	<?php
}
## Заполняем опцию 18
function fill_bg_playlist_field18(){
	$val = get_option('bg_playlist_options2');
	$val = (!empty($val) && isset($val['style'])) ? $val['style'] : 'light';
	?>
	<select name="bg_playlist_options2[style]">
		<option <?php selected('light', $val); ?> value='light'><?php _e('light','bg-playlist'); ?></option>
		<option <?php selected('dark', $val); ?> value='dark'><?php _e('dark','bg-playlist'); ?></option>
	</select>
	<?php
}
## Заполняем опцию 19
function fill_bg_playlist_field19(){
	$val = get_option('bg_playlist_options2');
	$val = (!empty($val) && isset($val['skin'])) ? $val['skin'] : '';
	?>
	<label><input type="text" name="bg_playlist_options2[skin]" value="<?php echo $val ?>" size="80" />
	<br><i><?php _e('For example','bg-playlist'); ?>,</i>
	<br><code><?php echo plugins_url( "skins/chrome.css", dirname (__FILE__) ); ?></code>
	<br><i>(<?php _e('use light style','bg-playlist'); ?>)</i></label>
	<?php
}




## Очистка данных
function bg_playlist_sanitize_callback( $options ){ 
	// очищаем
	foreach( $options as $name => & $val ){
// группа 1		
		if( $name == 'autoplaylist' )
			$val = intval( $val );

		if( $name == 'audioclass' ) {
			$val = sanitize_html_class( $val );
		}
		if( $name == 'preload' ) {
			$val = sanitize_html_class( $val );
			if (!$val) $val = 'none';
		}
		if( $name == 'noloop' )
			$val = intval( $val );
		
		if( $name == 'get_duration' )
			$val = intval( $val );
	
// группа 2		
		if( $name == 'show_header' )
			$val = intval( $val );

		if( $name == 'show_list' )
			$val = intval( $val );

		if( $name == 'show_numbers' )
			$val = intval( $val );

		if( $name == 'show_image' )
			$val = intval( $val );

		if( $name == 'show_artist' )
			$val = intval( $val );

		if( $name == 'show_album' )
			$val = intval( $val );

		if( $name == 'show_download' )
			$val = intval( $val );

		if( $name == 'show_play_pause' )
			$val = intval( $val );

		if( $name == 'style' ) {
			$val = sanitize_html_class( $val );
			if (!$val) $val = 'light';
		}
		if( $name == 'skin' ) {
			$val = esc_url( $val );
			if (!$val) $val = '';
		}
	}
	return $options;
}

## Получить опции
function bg_playlist_get_option() {
	add_option( 'bg_playlist_options1', 
		array ( 'autoplaylist'=>null,
				'audioclass'=>'wpaudio', 
				'preload'=>'none',
				'noloop'=>null,
				'get_duration'=>null,
		) 
	);
	add_option( 'bg_playlist_options2', 
		array ( 'show_header'=>1,					
				'show_list'=>1,
				'show_numbers'=>1,
				'show_image'=>1,
				'show_artist'=>1,
				'show_album'=>1,
				'show_download'=>1,
				'show_play_pause'=>1,
				'style'=>'light',
				'skin'=>'',
		) 
	);
	$val1 = get_option('bg_playlist_options1');
	if (!$val1) $val1=array();
	$val2 = get_option('bg_playlist_options2');
	if (!$val2) $val2=array();
	$val = array_merge($val1, $val2);
	return $val;
}
