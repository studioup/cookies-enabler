<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Cookies Enabler Demo Page</title>
    <link rel="stylesheet" href="css/style.css" media="all">
    <style>
        *{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
    <div id="fb-root"></div>
    <?php 
    function cookie_enabled(){
        if (isset($_COOKIE['ce-consent']) && $_COOKIE['ce-consent'] == 'Y'){
            return true;
        }
        echo '<div class="ce-blocked-iframe"></div>';
        return false;
    }?>
    <?php if(cookie_enabled()) {  ?>
    <a class="twitter-timeline" href="https://twitter.com/studioup" data-widget-id="605305928662020096">Tweet di @studioup</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
    <?php } ?>
    <script type="text/plain" class="ce-elm">
        // FB Demo
        (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=1402028420038023";
        fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    </script>
    <div class="fb-like" data-href="https://developers.facebook.com/docs/plugins/" data-layout="standard" data-action="like" data-show-faces="true" data-share="true"></div>
    <script >
        // GA Demo
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-XXXXX-X']);
        _gaq.push (['_gat._anonymizeIp']);
        _gaq.push(['_trackPageview']);
        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
    </script>
    <script src="cookies-enabler.js"></script>
    <script>
        
        COOKIES_ENABLER.init({
            element: 'ce-elm', // Default class
            bannerHTML: '<div class="ce-banner__inner">'+
                            '<h4 id="ce-banner__header">'+
                                '<div class="cookie-ita">Questo sito internet utilizza cookies</div>'+
                                '<div class="cookie-eng" style="display:none">This website uses cookies</div>'+
                            '</h4>'+
                            '<div class="cookie-ita">Questo sito internet utilizza cookies per migliorare la vostra esperienza d’uso. Utilizzando il nostro sito internet autorizza l’installazione dei cookies in accordo con la nostra Cookie Policy.</div>'+
                            '<div class="cookie-eng" style="display:none">This website uses cookies to improve user experience. By using our website you consent to all cookies in accordance with our Cookie Policy.</div>'+
                            '<br>'+
                            '<div class="ce-banner__buttons">'+
                                '<a href="#" class="ce-trigger">'+
                                    '<div class="cookie-ita">Accetto</div>'+
                                    '<div class="cookie-eng" style="display:none">Enable cookies</div>'+
                                '</a>'+
                                '<a class="ce-more" href="http://google.com" target="_self">'+
                                    '<div class="cookie-ita">Maggiori informazioni</div>'+
                                    '<div class="cookie-eng" style="display:none">Privacy policy</div>'+
                                '</a>'+
                            '</div>'+
                        '</div>',
            duration: '365', // Default duration cookis 365 days
            eventScroll: false, // Default false
            preventCookies: true,
            gatAnonymized : true,
            whitelistedCookies: ['_cfduid']
        });
        
    </script>
</body>
</html>