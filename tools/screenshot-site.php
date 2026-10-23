<?php
/** Local screenshot fixture only; loaded by screenshot-fixture.php's MU plugin. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
add_filter( 'show_admin_bar', '__return_false' );
add_filter( 'template_include', function ( $template ) {
	return is_front_page() && ! persona_assistant_is_fullscreen_preview() ? __FILE__ : $template;
}, 100 );
if ( ! did_action( 'template_redirect' ) || ! is_front_page() || persona_assistant_is_fullscreen_preview() ) { return; }
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?>
<style>
*{box-sizing:border-box}body{margin:0;background:#faf7f0;color:#36291f;font-family:Arial,sans-serif}a{color:inherit;text-decoration:none}.bakery-nav{display:flex;align-items:center;justify-content:space-between;padding:34px 70px;border-bottom:1px solid #e6dece}.bakery-logo{font-family:Georgia,serif;font-size:30px;letter-spacing:-1px}.bakery-links{display:flex;gap:34px;font-size:14px}.bakery-hero{padding:88px 70px 72px;max-width:1170px}.bakery-eyebrow{font-size:12px;letter-spacing:3px;font-weight:bold;text-transform:uppercase;color:#805238}.bakery-hero h1{font-family:Georgia,serif;font-size:88px;line-height:1.05;letter-spacing:-4px;font-weight:normal;max-width:760px;margin:25px 0}.bakery-hero p{font-size:19px;line-height:1.7;color:#746252;max-width:540px}.bakery-button{display:inline-block;background:#805238;color:white;border-radius:4px;padding:17px 25px;margin-top:22px;font-size:14px}.bakery-bottom{border-top:1px solid #e6dece;padding:38px 70px;display:flex;gap:90px}.bakery-bottom h2{font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 14px}.bakery-bottom p{font-size:15px;line-height:1.8;color:#746252;margin:0}.bakery-mark{position:absolute;right:110px;top:220px;font-family:Georgia,serif;font-size:170px;color:#d7c6aa;transform:rotate(12deg);z-index:-1}
</style></head><body><?php wp_body_open(); ?>
<header class="bakery-nav"><a class="bakery-logo" href="/">flour & stone.</a><nav class="bakery-links"><a href="#bread">Our bread</a><a href="#visit">Visit the bakery</a><a href="/assistant/">Ask us anything ↗</a></nav></header>
<main><section class="bakery-hero"><span class="bakery-eyebrow">Your neighborhood bakery · Est. 2018</span><h1>Slow mornings.<br>Good bread.</h1><p>Long-fermented sourdough, buttery pastries, and a warm welcome. Made by hand, every morning.</p><a class="bakery-button" href="#bread">Find your daily bread →</a></section>
<section class="bakery-bottom"><div id="bread"><h2>Made with patience</h2><p>Organic flour. Wild yeast. A little time.<br>Simple ingredients, extraordinary bread.</p></div><div id="visit"><h2>Come on by</h2><p>Tuesday–Sunday · 7am–3pm<br>42 Market Street · Portland</p></div></section></main>
<?php wp_footer(); ?></body></html>
