import { escPhp, NOT_LEGAL } from "./input.js";
import { bannerCss, bannerText } from "./banner.js";
import { jsonLdFor } from "./jsonld.js";

export const WP_SLUG = "kok-ai-disclosure";

export function generateWordPress(cfg) {
  const lines = bannerText(cfg);
  const phpLines = lines.map((l) => `'${escPhp(l)}'`).join(",\n\t\t");
  const baseDoc = jsonLdFor(cfg, "text");
  // Static parts of the JSON-LD; the page name is filled in at runtime.
  const phpDoc = `array(
		'@context' => 'https://schema.org',
		'@type' => 'Article',
		'name' => $name,
		'isPartOf' => array( '@type' => 'WebSite', 'name' => KOK_AID_SITE${cfg.siteUrl ? `, 'url' => '${escPhp(cfg.siteUrl)}'` : ""} ),
		'creator' => ${cfg.botName ? `array( '@type' => 'SoftwareApplication', 'name' => '${escPhp(cfg.botName)}', 'applicationCategory' => 'AI system' )` : `array( '@type' => 'Organization', 'name' => KOK_AID_SITE )`},
		'additionalProperty' => array(
			array( '@type' => 'PropertyValue', 'name' => 'aiGenerated', 'value' => true ),
			array( '@type' => 'PropertyValue', 'name' => 'digitalSourceType', 'value' => '${baseDoc.additionalProperty[1].value}' ),
		),
		'disclaimer' => 'This content was generated or manipulated by an AI system.',
	)`;

  const php = `<?php
/**
 * Plugin Name: AI Disclosure (${cfg.siteName.replace(/\*\//g, "")})
 * Description: Prints an AI disclosure banner, per-post "AI-generated" label and JSON-LD flag. ${NOT_LEGAL}
 * Version: 0.1.0
 * Author: Kingdom of Kumar
 * License: MIT
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'KOK_AID_SITE', '${escPhp(cfg.siteName)}' );
define( 'KOK_AID_META', '_kok_aid_ai_generated' );

function kok_aid_lines() {
	return array(
		${phpLines || "''"}
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
	echo '<style id="kok-aid-css">' . ${"'"}${escPhp(bannerCss().replace(/\s*\/\*[^*]*\*\/\s*/g, ""))}${"'"} . '</style>' . "\\n";
	if ( kok_aid_flagged() ) {
		echo '<meta name="ai-generated" content="true">' . "\\n";
		$name = wp_strip_all_tags( get_the_title() );
		$doc  = ${phpDoc};
		echo '<script type="application/ld+json">' . wp_json_encode( $doc, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP ) . '</script>' . "\\n";
	}
}, 5 );

/* Footer: sitewide banner (JS inserts it at the top of <body>) and the per-post badge. */
add_action( 'wp_footer', function () {
	$lines = kok_aid_lines();
	$cfg   = array(
		'siteName' => KOK_AID_SITE,
		'lines'    => $lines,
		'badge'    => 'AI-generated',
		'chatNotice' => ${cfg.contentTypes.includes("chat") ? `'${escPhp(cfg.botName ? `${cfg.botName} is an AI system, not a person.` : "This is an AI system, not a person.")}'` : "''"},
		'infoUrl'  => '',
	);
	echo '<script id="kok-aid-js">';
	echo 'window.__kokAidCfg=' . wp_json_encode( $cfg, JSON_HEX_TAG | JSON_HEX_AMP ) . ';';
	echo ${"'"}${escPhp("(" + "function(){" + "var C=window.__kokAidCfg;if(!C||window.__kokAid)return;window.__kokAid=true;" +
      "function b(){if(!C.lines.length||document.getElementById('kok-aid-banner'))return;var e=document.createElement('div');e.id='kok-aid-banner';e.className='kok-aid-banner';e.setAttribute('role','region');e.setAttribute('aria-label','AI disclosure');var i=document.createElement('div');i.className='kok-aid-banner__inner';var t=document.createElement('span');t.className='kok-aid-banner__tag';t.textContent='AI';var x=document.createElement('div');C.lines.forEach(function(l){var p=document.createElement('p');p.textContent=l;x.appendChild(p)});i.appendChild(t);i.appendChild(x);e.appendChild(i);document.body.insertBefore(e,document.body.firstChild)}" +
      "function g(){Array.prototype.forEach.call(document.querySelectorAll('[data-ai-generated]:not([data-kok-aid-done])'),function(n){if(n.getAttribute('data-ai-generated')==='false')return;n.setAttribute('data-kok-aid-done','1');var s=document.createElement('span');s.className='kok-aid-badge';s.textContent=C.badge;n.insertBefore(s,n.firstChild)})}" +
      "function c(){if(!C.chatNotice)return;Array.prototype.forEach.call(document.querySelectorAll('[data-ai-chat]:not([data-kok-aid-done])'),function(n){n.setAttribute('data-kok-aid-done','1');var d=document.createElement('div');d.className='kok-aid-chat';d.setAttribute('role','note');d.textContent=C.chatNotice;n.insertBefore(d,n.firstChild)})}" +
      "function r(){b();g();c()}if(document.readyState!=='loading')r();else document.addEventListener('DOMContentLoaded',r);})();")}${"'"};
	echo '</script>';
} );

/* Single posts flagged as AI-generated: add a visible label above the content. */
add_filter( 'the_content', function ( $content ) {
	if ( kok_aid_flagged() && in_the_loop() && is_main_query() ) {
		return '<p><span class="kok-aid-badge">' . esc_html__( 'AI-generated', 'kok-ai-disclosure' ) . '</span></p>' . $content;
	}
	return $content;
} );
`;

  const readme = `=== AI Disclosure (${cfg.siteName.replace(/[=\n]/g, " ")}) ===
Contributors: kingdomofkumar
Requires at least: 5.8
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 0.1.0
License: MIT

Prints an AI disclosure banner sitewide, a per-post "AI-generated" label and a JSON-LD flag.

== Description ==
${NOT_LEGAL}
It helps you show people when content or an assistant is AI. Whether and how Article 50 of Regulation (EU) 2024/1689 applies to you is for you and your lawyer to decide.

== Installation ==
1. Upload the ${WP_SLUG} folder to /wp-content/plugins/ (or upload the zip in Plugins > Add New > Upload).
2. Activate it.
3. Tick "This content is AI-generated or AI-manipulated" on each post or page that needs it.
4. Mark a chat widget container with the attribute data-ai-chat if you use an assistant.

== Changelog ==
= 0.1.0 =
* First release.
`;
  return {
    folder: WP_SLUG,
    files: {
      [`wordpress/${WP_SLUG}/${WP_SLUG}.php`]: php,
      [`wordpress/${WP_SLUG}/readme.txt`]: readme,
    },
  };
}
