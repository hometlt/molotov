/*
 *
 *  Flash by Molotov
 *	Copyright (c) 2013 Denis Ponomarev
 *	http://hometlt.ru
 *
 *
 */

(function( $, window, document, undefined ) {

    //получаем список файлов
    function getFileList (libs,path){
            if(!$.isArray (libs)) libs = [libs];
            var libs2 = [];
            for(var i=0; i< libs.length;i++){

                if( path)libs[i]= path + libs[i];
                if(libs[i].indexOf("{")!=-1 && libs[i].indexOf("}")!=-1){
                    var prefix =  libs[i].substring(0,libs[i].indexOf("{")),
                        postfix = libs[i].substring(libs[i].indexOf("}")+1),
                        arr = libs[i].substring(libs[i].indexOf("{")+1,libs[i].indexOf("}") ).split(",");
                    for(var j=0; j< arr.length;j++){
                        if(/^[0-9]+-[0-9]+$/.test(arr[j])){
                            var nums = arr[j].split("-");
                            for(var n = parseInt(nums[0]); n<=parseInt(nums[1]);n++){
                                libs2.push(prefix + n + postfix);
                            }
                        }else{
                            libs2.push(prefix + arr[j] + postfix);
                        }

                    }
                }else{
                    libs2.push(libs[i]);
                }
            }
            return libs2;
        }

    //загружаем изображеия
    function initSprite(options,obj){
        var images = options.images;

        if(!images) images = obj.attr("data-images");
        var _height = options.height || parseInt(obj.attr("data-height")) || 600;
        var _width = options.width || parseInt(obj.attr("data-width")) || 900;
        obj.addClass("sprite loading").css(options.responsive? "max-width" : "width",_width);

//        var animation_static = $("<img src='byMolotov.jpg'/></div>");
        var animation_dynamic = $("<div>").addClass('camera-sprite');
        var loader = $('<div class="sprite-loader sprite-overlay">').append(
            $('<div class="sprite-child">').append(
                $('<p class="sprite-text">Flash by Molotov <span class="sprite-loader-status">0</span>%</p>'),
                animation_dynamic
            )
        );
        var spriteControl = $("<div>").addClass("sprite-control").hide();
        var spriteInner = $("<div>").addClass("sprite-inner").hide();
        obj.append(loader,spriteControl,spriteInner);

        var img = new Image();
        img.onload = function(){

            var slide = 0;
            var interval = setInterval(function(){
                slide++;
                if(slide == 11)slide = 0;
                animation_dynamic.css("background-position",- slide * 560 + "px 0");
            },400);

            var loaded = 0;
            var files = getFileList(images);
            var lastcontrol = -1;

            var controls = [];
            var control_width = 1 / files.length;
            for(var i in files){
                (function(i){
                    var img = $('<img />');

                    var control = $("<div/>").width(100 * control_width + "%").attr("data-sprite",i);
                    function onload(){
                        if(loaded == files.length){
                            clearInterval(interval);
                            loader.remove();
                            spriteInner.show();
                            spriteControl.show();
                            obj.removeClass("loading");
                        }
                    }
                    $(img).bind({
                        load: function() {
                            loaded++;
                            loader.find(".sprite-loader-status").text(Math.floor(loaded / files.length * 100));
                            onload();
                        },
                        error: function() {
                            obj.addClass("failed");
                            loader.find(".sprite-text").append(
                                '<br/>Error thrown, image ' + files[i] +' didn\'t load, probably a 404.');
                            animation_dynamic.remove();
                            clearInterval(interval);
                        }
                    });

                    controls.push(control);
                    spriteControl.append(control);
                    spriteInner.append(img);
                    $(img).attr('src',files[i]);
                })(i);

                spriteControl.bind("mousemove touchmove",function(e){
                    e.preventDefault();
                    var x = e.originalEvent && e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0].pageX: e.pageX;

                    var l =(x - $(this).offset().left )/ $(this).width();
                    var target = Math.floor(l / control_width);

                    if(!controls[target] || lastcontrol == target )return;
                    lastcontrol = target;
                    controls[target].stop().css("opacity",0.2).animate({opacity: 0},1000);
                    spriteInner.css("margin-left",-100*target + "%");
                });
            }

        };
        img.src = "../src/camspr.png";


        function spriteloaderresize(obj){
            obj.height(obj.width()/_width * _height );
        }

        if(options.responsive){
            $(window).resize(function(){
                spriteloaderresize(obj);
            });
            spriteloaderresize(obj);
        }else if(_height){
            obj.height(_height);
        }
    }

    $.fn.sprite = function( options ){
        if(!options)options = $.fn.sprite.options;
        return this.each(function() {
            initSprite(options,$(this));
        });
    };

    $.fn.sprite.options = {
        images 	 : false,
        responsive: false,
        height: false,
        width: false
    };
})( jQuery, window, document );