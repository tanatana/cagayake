/*
 * jQuery.cagayake.js
 *
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */
(function ($) {
    var Cagayake = function(target, __options__){
        var svgns         = 'http://www.w3.org/2000/svg';
        var $target       = $(target);
        var $svgContainer = $('<div class="cagayake-container"></div>');
        var $svg          = $(document.createElementNS(svgns, 'svg'));
        var options       = {
            debug: true,
            color: {H:190, S:56, L:53},
            edgeLength: 100,
            offset: {x: 1, y: 0.2},
            svgOffset: {x:10, y:10},
            opacity: 1.0,
            colorShake: 0,
            animation: null
        };
        options = $.extend({}, options, __options__);

        var baseTriangle  = [{x:0, y:0},
                             {x: -1 * options.edgeLength / 2,
                              y: Math.sqrt(3) * options.edgeLength / 2},
                             {x: options.edgeLength / 2,
                              y: Math.sqrt(3) * options.edgeLength / 2}];
        var baseTriangleR = [{x:0, y:0},
                             {x: -1 * options.edgeLength / 2,
                              y: -1 * Math.sqrt(3) * options.edgeLength / 2},
                             {x: options.edgeLength / 2,
                              y: -1 * Math.sqrt(3) * options.edgeLength / 2}];

        var appendTriangles = function(){
            var triangle;
            var width = $svg.width();
            var height = $svg.height();
            var i;
            var j;
            for(i = 0; i * (Math.sqrt(3) * (options.edgeLength / 2) +  options.offset.y) <= height ; i += 1){
                for(j = 0; j * (options.edgeLength +  options.offset.x) <= width ; j += 1){
                    var x, y;
                    y = i * (Math.sqrt(3) * (options.edgeLength / 2) +  options.offset.y);
                    if (i % 2 != 0 ){
                        x = j * (options.edgeLength +  options.offset.x) + (options.edgeLength + options.offset.x) / 2;
                    } else {
                        x = j * (options.edgeLength +  options.offset.x);
                    }
                    var points = {
                        x: x,
                        y: y
                    };
                    $svg.append(createTriangle(points));
                    $svg.append(createTriangle(points, true));
                }
            }
        };

        var createTriangle = function(points, reverse){
            var triangle = document.createElementNS(svgns, 'polygon');
            var pointsStrings = [];
            var angleIndex = 0;
            var color = generateColor(options.color, options.colorShake);
            if (reverse) {
                for (;angleIndex < baseTriangle.length ; angleIndex += 1){
                    pointsStrings.push((baseTriangleR[angleIndex].x + points.x) + "," + (baseTriangleR[angleIndex].y + points.y));
                }

            } else  {
                for (;angleIndex < baseTriangle.length ; angleIndex += 1){
                    pointsStrings.push((baseTriangle[angleIndex].x + points.x) + "," + (baseTriangle[angleIndex].y + points.y));
                }
            }
            triangle.setAttributeNS(null, 'points', pointsStrings.join(" "));
            triangle.setAttributeNS(null, 'fill', color.string);
            triangle.setAttributeNS(null, 'data-original-color', color.native);
            return triangle;
        };

        var generateColor = function(color, colorShake){
            var shake  = Math.floor(Math.random() * colorShake) - colorShake / 2;
            var hsl = "hsl(" + (color.H + shake) + ", " + color.S + "%, " + color.L + "%)";
            var colorObj = {
                string: hsl,
                native: JSON.stringify({H: color.H + shake, S: color.S, L: color.L})
            };
            return colorObj;
        };

        var __init__ = function(){
            $svg.css({
                position: 'absolute',
                top: options.svgOffset.y * -1,
                left: options.svgOffset.x * -1,
                height: $target.outerHeight() + options.edgeLength*2,
                width: $target.outerWidth() + options.edgeLength*2,
                overflow: 'hidden',
                opacity: options.opacity
            });

            $svgContainer.css({
                position: 'absolute',
                top: 0,
                left: 0,
                height: $target.outerHeight(),
                width: $target.outerWidth(),
                overflow: 'hidden'
            });

            console.log($target.outerHeight());

            if($target[0].tagName !== 'BODY') {
                var $originalContents = $target.clone();
                var padding = $target.css('padding');
                $svgContainer.css({
                    position: 'relative',
                    top: padding.top * -1,
                    left: padding.left * -1,
                    height: $target.outerHeight(),
                    padding: padding
                });
                $originalContents.css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    padding: padding
                });
                $target.css({padding: '0px'});
                $target.empty();
                $svgContainer.append($svg);
                $svgContainer.append($originalContents);
                $target.prepend($svgContainer);
            } else {
                $svgContainer.append($svg);
                $target.prepend($svgContainer);
            }

            appendTriangles();

            if(options.animation){
                if(options.animation.color){
                    var animationCounter = 0;
                    var shakeColor = options.animation.color;
                    setInterval(function(){
                        var triangles = $svg[0].getElementsByTagName('polygon');
                        var trianglesIndex;
                        var originalColor;
                        var color;
                        var reviseDeg;
                        for(trianglesIndex = 0;trianglesIndex < triangles.length; trianglesIndex += 1){
                            originalColor = JSON.parse(triangles[trianglesIndex].getAttributeNS(null, 'data-original-color'));
                            reviseDeg = Math.sin(animationCounter/15) * shakeColor - shakeColor/2;
                            color = {H: originalColor.H + reviseDeg,
                                     S: originalColor.S,
                                     L: originalColor.L};

                            triangles[trianglesIndex].setAttributeNS(null, 'fill', generateColor(color, 3).string);
                        }



                        animationCounter += 1;
                    }, 100);
                }
            }

        };

        __init__();
    };

    $.fn.cagayake = function(options){
        $.each(this,function(){
            new Cagayake(this, options);
        });
    };

}(jQuery));
