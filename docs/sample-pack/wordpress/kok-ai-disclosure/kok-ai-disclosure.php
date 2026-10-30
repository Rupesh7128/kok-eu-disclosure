<?php
/**
 * Plugin Name: AI Disclosure (Harbour & Pine Studio)
 * Description: Prints an AI disclosure banner, per-post "AI-generated" label and JSON-LD flag. Tooling for transparency obligations; not legal advice.
 * Version: 0.1.0
 * Author: Kingdom of Kumar
 * License: MIT
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'KOK_AID_SITE', 'Harbour & Pine Studio' );
define( 'KOK_AID_META', '_kok_aid_ai_generated' );

function kok_aid_lines() {
	return array(
		'You are talking to Pine, an AI system, not a person.',
		'Some text and image content on Harbour & Pine Studio is generated or manipulated by AI. Where it appears it is labelled “AI-generated”.'
	);
}

/* Meta box: "This post is AI-generated or AI-manipulated". */
add_action( 'add_meta_boxes', function () {
	add_meta_box( 'kok_aid', 'AI disclosure', function ( $post ) {
		wp_nonce_field( 'kok_aid_save', 'kok_aid_nonce' );
		$on = get_post_meta( $post->ID, KOK_AID_META, true ) === '1';
		echo '<label><input type="checkbox" name="kok_aid_flag" value="1"' . checked( $on, true, false ) . '> ';
		echo esc_html__( 'This content is AI-generated or AI-manipulated', 'kok-ai-disclosure' ) . '</label>';
	}, array( 'post', 'page' ), 'side' );
} );

add_action( 'save_post', function ( $post_id ) {
	if ( ! isset( $_POST['kok_aid_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['kok_aid_nonce'] ) ), 'kok_aid_save' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	if ( ! empty( $_POST['kok_aid_flag'] ) ) {
		update_post_meta( $post_id, KOK_AID_META, '1' );
	} else {
		delete_post_meta( $post_id, KOK_AID_META );
	}
} );

function kok_aid_flagged() {
	return is_singular() && get_post_meta( get_the_ID(), KOK_AID_META, true ) === '1';
}

/* <head>: meta tag + JSON-LD (flagged posts only) + CSS. */
add_action( 'wp_head', function () {
	echo '<style id="kok-aid-css">' . '.kok-aid-banner{font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;background:#0e1b1d;color:#eeebe3;border-bottom:4px solid #b83a07;padding:12px 20px}
.kok-aid-banner__inner{max-width:72rem;margin:0 auto;display:flex;gap:14px;align-items:flex-start}
.kok-aid-banner__tag{flex:none;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;background:#b83a07;color:#eeebe3;padding:2px 8px;margin-top:2px}
.kok-aid-banner p{margin:0 0 4px}
.kok-aid-banner p:last-child{margin:0}
.kok-aid-banner a{color:#eeebe3;text-decoration:underline;text-underline-offset:3px}
.kok-aid-banner a:focus-visible,.kok-aid-badge:focus-visible{outline:3px solid #b83a07;outline-offset:2px}
.kok-aid-badge{display:inline-block;font:700 12px/1.4 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;border:2px solid #b83a07;color:#0e1b1d;background:#eeebe3;padding:1px 7px;margin:0 8px 8px 0;vertical-align:middle}
.kok-aid-chat{font:14px/1.45 system-ui,sans-serif;border-left:4px solid #b83a07;background:#eeebe3;color:#0e1b1d;padding:8px 12px;margin:0 0 10px}
@media (forced-colors:active){.kok-aid-banner,.kok-aid-badge,.kok-aid-chat{border:2px solid CanvasText}}' . '</style>' . "\n";
	if ( kok_aid_flagged() ) {
		echo '<meta name="ai-generated" content="true">' . "\n";
		$name = wp_strip_all_tags( get_the_title() );
		$doc  = array(
		'@context' => 'https://schema.org',
		'@type' => 'Article',
		'name' => $name,
		'isPartOf' => array( '@type' => 'WebSite', 'name' => KOK_AID_SITE, 'url' => 'https://example.com' ),
		'creator' => array( '@type' => 'SoftwareApplication', 'name' => 'Pine', 'applicationCategory' => 'AI system' ),
		'additionalProperty' => array(
			array( '@type' => 'PropertyValue', 'name' => 'aiGenerated', 'value' => true ),
			array( '@type' => 'PropertyValue', 'name' => 'digitalSourceType', 'value' => 'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia' ),
		),
		'disclaimer' => 'This content was generated or manipulated by an AI system.',
	);
		echo '<script type="application/ld+json">' . wp_json_encode( $doc, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP ) . '</script>' . "\n";
	}
}, 5 );

/* Footer: sitewide banner (JS inserts it at the top of <body>) and the per-post badge. */
add_action( 'wp_footer', function () {
	$lines = kok_aid_lines();
	$cfg   = array(
		'siteName' => KOK_AID_SITE,
		'lines'    => $lines,
		'badge'    => 'AI-generated',
		'chatNotice' => 'Pine is an AI system, not a person.',
		'infoUrl'  => '',
	);
	echo '<script id="kok-aid-js">';
	echo 'window.__kokAidCfg=' . wp_json_encode( $cfg, JSON_HEX_TAG | JSON_HEX_AMP ) . ';';
	echo '(function(){var C=window.__kokAidCfg;if(!C||window.__kokAid)return;window.__kokAid=true;function b(){if(!C.lines.length||document.getElementById(\'kok-aid-banner\'))return;var e=document.createElement(\'div\');e.id=\'kok-aid-banner\';e.className=\'kok-aid-banner\';e.setAttribute(\'role\',\'region\');e.setAttribute(\'aria-label\',\'AI disclosure\');var i=document.createElement(\'div\');i.className=\'kok-aid-banner__inner\';var t=document.createElement(\'span\');t.className=\'kok-aid-banner__tag\';t.textContent=\'AI\';var x=document.createElement(\'div\');C.lines.forEach(function(l){var p=document.createElement(\'p\');p.textContent=l;x.appendChild(p)});i.appendChild(t);i.appendChild(x);e.appendChild(i);document.body.insertBefore(e,document.body.firstChild)}function g(){Array.prototype.forEach.call(document.querySelectorAll(\'[data-ai-generated]:not([data-kok-aid-done])\'),function(n){if(n.getAttribute(\'data-ai-generated\')===\'false\')return;n.setAttribute(\'data-kok-aid-done\',\'1\');var s=document.createElement(\'span\');s.className=\'kok-aid-badge\';s.textContent=C.badge;n.insertBefore(s,n.firstChild)})}function c(){if(!C.chatNotice)return;Array.prototype.forEach.call(document.querySelectorAll(\'[data-ai-chat]:not([data-kok-aid-done])\'),function(n){n.setAttribute(\'data-kok-aid-done\',\'1\');var d=document.createElement(\'div\');d.className=\'kok-aid-chat\';d.setAttribute(\'role\',\'note\');d.textContent=C.chatNotice;n.insertBefore(d,n.firstChild)})}function r(){b();g();c()}if(document.readyState!==\'loading\')r();else document.addEventListener(\'DOMContentLoaded\',r);})();';
	echo '</script>';
} );

/* Single posts flagged as AI-generated: add a visible label above the content. */
add_filter( 'the_content', function ( $content ) {
	if ( kok_aid_flagged() && in_the_loop() && is_main_query() ) {
		return '<p><span class="kok-aid-badge">' . esc_html__( 'AI-generated', 'kok-ai-disclosure' ) . '</span></p>' . $content;
	}
	return $content;
} );
