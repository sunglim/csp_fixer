<script>

  (function() {

    var wavemaxradius = 150;
    //
    // ink equations
    //
    function waveradiusfn(touchdownms, touchupms, anim) {
      // convert from ms to s.
      var touchdown = touchdownms / 1000;
      var touchup = touchupms / 1000;
      var totalelapsed = touchdown + touchup;
      var ww = anim.width, hh = anim.height;
      // use diagonal size of container to avoid floating point math sadness
      var waveradius = math.min(math.sqrt(ww * ww + hh * hh), wavemaxradius) * 1.1 + 5;
      var duration = 1.1 - .2 * (waveradius / wavemaxradius);
      var tt = (totalelapsed / duration);

      var size = waveradius * (1 - math.pow(80, -tt));
      return math.abs(size);
    }

    function waveopacityfn(td, tu, anim) {
      // convert from ms to s.
      var touchdown = td / 1000;
      var touchup = tu / 1000;
      var totalelapsed = touchdown + touchup;

      if (tu <= 0) {  // before touch up
        return anim.initialopacity;
      }
      return math.max(0, anim.initialopacity - touchup * anim.opacitydecayvelocity);
    }

    function waveouteropacityfn(td, tu, anim) {
      // convert from ms to s.
      var touchdown = td / 1000;
      var touchup = tu / 1000;

      // linear increase in background opacity, capped at the opacity
      // of the wavefront (waveopacity).
      var outeropacity = touchdown * 0.3;
      var waveopacity = waveopacityfn(td, tu, anim);
      return math.max(0, math.min(outeropacity, waveopacity));
    }

    // determines whether the wave should be completely removed.
    function wavedidfinish(wave, radius, anim) {
      var waveopacity = waveopacityfn(wave.tdown, wave.tup, anim);

      // if the wave opacity is 0 and the radius exceeds the bounds
      // of the element, then this is finished.
      return waveopacity < 0.01 && radius >= math.min(wave.maxradius, wavemaxradius);
    };

    function waveatmaximum(wave, radius, anim) {
      var waveopacity = waveopacityfn(wave.tdown, wave.tup, anim);

      return waveopacity >= anim.initialopacity && radius >= math.min(wave.maxradius, wavemaxradius);
    }

    //
    // drawing
    //
    function drawripple(ctx, x, y, radius, inneralpha, outeralpha) {
      // only animate opacity and transform
      if (outeralpha !== undefined) {
        ctx.bg.style.opacity = outeralpha;
      }
      ctx.wave.style.opacity = inneralpha;

      var s = radius / (ctx.containersize / 2);
      var dx = x - (ctx.containerwidth / 2);
      var dy = y - (ctx.containerheight / 2);

      ctx.wc.style.webkittransform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
      ctx.wc.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';

      // 2d transform for safari because of border-radius and overflow:hidden clipping bug.
      // https://bugs.webkit.org/show_bug.cgi?id=98538
      ctx.wave.style.webkittransform = 'scale(' + s + ',' + s + ')';
      ctx.wave.style.transform = 'scale3d(' + s + ',' + s + ',1)';
    }

    //
    // setup
    //
    function createwave(elem) {
      var elementstyle = window.getcomputedstyle(elem);
      var fgcolor = elementstyle.color;

      var inner = document.createelement('div');
      inner.style.backgroundcolor = fgcolor;
      inner.classlist.add('wave');

      var outer = document.createelement('div');
      outer.classlist.add('wave-container');
      outer.appendchild(inner);

      var container = elem.$.waves;
      container.appendchild(outer);

      elem.$.bg.style.backgroundcolor = fgcolor;

      var wave = {
        bg: elem.$.bg,
        wc: outer,
        wave: inner,
        wavecolor: fgcolor,
        maxradius: 0,
        ismousedown: false,
        mousedownstart: 0.0,
        mouseupstart: 0.0,
        tdown: 0,
        tup: 0
      };
      return wave;
    }

    function removewavefromscope(scope, wave) {
      if (scope.waves) {
        var pos = scope.waves.indexof(wave);
        scope.waves.splice(pos, 1);
        // fixme cache nodes
        wave.wc.remove();
      }
    };

    // shortcuts.
    var pow = math.pow;
    var now = date.now;
    if (window.performance && performance.now) {
      now = performance.now.bind(performance);
    }

    function csscolorwithalpha(csscolor, alpha) {
        var parts = csscolor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (typeof alpha == 'undefined') {
            alpha = 1;
        }
        if (!parts) {
          return 'rgba(255, 255, 255, ' + alpha + ')';
        }
        return 'rgba(' + parts[1] + ', ' + parts[2] + ', ' + parts[3] + ', ' + alpha + ')';
    }

    function dist(p1, p2) {
      return math.sqrt(pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2));
    }

    function distancefrompointtofurthestcorner(point, size) {
      var tl_d = dist(point, {x: 0, y: 0});
      var tr_d = dist(point, {x: size.w, y: 0});
      var bl_d = dist(point, {x: 0, y: size.h});
      var br_d = dist(point, {x: size.w, y: size.h});
      return math.max(tl_d, tr_d, bl_d, br_d);
    }

    polymer('paper-ripple', {

      /**
       * the initial opacity set on the wave.
       *
       * @attribute initialopacity
       * @type number
       * @default 0.25
       */
      initialopacity: 0.25,

      /**
       * how fast (opacity per second) the wave fades out.
       *
       * @attribute opacitydecayvelocity
       * @type number
       * @default 0.8
       */
      opacitydecayvelocity: 0.8,

      backgroundfill: true,
      pixeldensity: 2,

      eventdelegates: {
        down: 'downaction',
        up: 'upaction'
      },

      ready: function() {
        this.waves = [];
      },

      downaction: function(e) {
        var wave = createwave(this);

        this.cancelled = false;
        wave.ismousedown = true;
        wave.tdown = 0.0;
        wave.tup = 0.0;
        wave.mouseupstart = 0.0;
        wave.mousedownstart = now();

        var rect = this.getboundingclientrect();
        var width = rect.width;
        var height = rect.height;
        var touchx = e.x - rect.left;
        var touchy = e.y - rect.top;

        wave.startposition = {x:touchx, y:touchy};

        if (this.classlist.contains("recenteringtouch")) {
          wave.endposition = {x: width / 2,  y: height / 2};
          wave.slidedistance = dist(wave.startposition, wave.endposition);
        }
        wave.containersize = math.max(width, height);
        wave.containerwidth = width;
        wave.containerheight = height;
        wave.maxradius = distancefrompointtofurthestcorner(wave.startposition, {w: width, h: height});

        // the wave is circular so constrain its container to 1:1
        wave.wc.style.top = (wave.containerheight - wave.containersize) / 2 + 'px';
        wave.wc.style.left = (wave.containerwidth - wave.containersize) / 2 + 'px';
        wave.wc.style.width = wave.containersize + 'px';
        wave.wc.style.height = wave.containersize + 'px';

        this.waves.push(wave);

        if (!this._loop) {
          this._loop = this.animate.bind(this, {
            width: width,
            height: height
          });
          requestanimationframe(this._loop);
        }
        // else there is already a raf
      },

      upaction: function() {
        for (var i = 0; i < this.waves.length; i++) {
          // declare the next wave that has mouse down to be mouse'ed up.
          var wave = this.waves[i];
          if (wave.ismousedown) {
            wave.ismousedown = false
            wave.mouseupstart = now();
            wave.mousedownstart = 0;
            wave.tup = 0.0;
            break;
          }
        }
        this._loop && requestanimationframe(this._loop);
      },

      cancel: function() {
        this.cancelled = true;
      },

      animate: function(ctx) {
        var shouldrendernextframe = false;

        var deletethesewaves = [];
        // the oldest wave's touch down duration
        var longesttouchdownduration = 0;
        var longesttouchupduration = 0;
        // save the last known wave color
        var lastwavecolor = null;
        // wave animation values
        var anim = {
          initialopacity: this.initialopacity,
          opacitydecayvelocity: this.opacitydecayvelocity,
          height: ctx.height,
          width: ctx.width
        }

        for (var i = 0; i < this.waves.length; i++) {
          var wave = this.waves[i];

          if (wave.mousedownstart > 0) {
            wave.tdown = now() - wave.mousedownstart;
          }
          if (wave.mouseupstart > 0) {
            wave.tup = now() - wave.mouseupstart;
          }

          // determine how long the touch has been up or down.
          var tup = wave.tup;
          var tdown = wave.tdown;
          longesttouchdownduration = math.max(longesttouchdownduration, tdown);
          longesttouchupduration = math.max(longesttouchupduration, tup);

          // obtain the instantenous size and alpha of the ripple.
          var radius = waveradiusfn(tdown, tup, anim);
          var wavealpha =  waveopacityfn(tdown, tup, anim);
          var wavecolor = csscolorwithalpha(wave.wavecolor, wavealpha);
          lastwavecolor = wave.wavecolor;

          // position of the ripple.
          var x = wave.startposition.x;
          var y = wave.startposition.y;

          // ripple gravitational pull to the center of the canvas.
          if (wave.endposition) {

            // this translates from the origin to the center of the view  based on the max dimension of
            var translatefraction = math.min(1, radius / wave.containersize * 2 / math.sqrt(2) );

            x += translatefraction * (wave.endposition.x - wave.startposition.x);
            y += translatefraction * (wave.endposition.y - wave.startposition.y);
          }

          // if we do a background fill fade too, work out the correct color.
          var bgfillcolor = null;
          if (this.backgroundfill) {
            var bgfillalpha = waveouteropacityfn(tdown, tup, anim);
            bgfillcolor = csscolorwithalpha(wave.wavecolor, bgfillalpha);
          }

          // draw the ripple.
          drawripple(wave, x, y, radius, wavealpha, bgfillalpha);

          // determine whether there is any more rendering to be done.
          var maximumwave = waveatmaximum(wave, radius, anim);
          var wavedissipated = wavedidfinish(wave, radius, anim);
          var shouldkeepwave = !wavedissipated || maximumwave;
          // keep rendering dissipating wave when at maximum radius on upaction
          var shouldrenderwaveagain = wave.mouseupstart ? !wavedissipated : !maximumwave;
          shouldrendernextframe = shouldrendernextframe || shouldrenderwaveagain;
          if (!shouldkeepwave || this.cancelled) {
            deletethesewaves.push(wave);
          }
       }

        if (shouldrendernextframe) {
          requestanimationframe(this._loop);
        }

        for (var i = 0; i < deletethesewaves.length; ++i) {
          var wave = deletethesewaves[i];
          removewavefromscope(this, wave);
        }

        if (!this.waves.length && this._loop) {
          // clear the background color
          this.$.bg.style.backgroundcolor = null;
          this._loop = null;
          this.fire('core-transitionend');
        }
      }

    });

  })();

</script>