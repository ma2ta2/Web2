/**
 * @author phi
 * TM に new は必要ない
 */

(function(){ "use strict"; })();

/**
 * TM ライブラリ.
 * JavaScript をより使いやすく, より便利に, そしてより豊かに.
 * @namespace
 * @see <a href="./../test/tmlib-test.html">Test Program</a>.
 */
var TM = TM || {};



/**
 * Core extend
 * 基本形の拡張
 */
(function(){
    
    /**
     * 変数定義
     * @function
     * @name    defineVariable
     * @param {Object} name
     * @param {Object} param
     * @methodOf    Object.prototype
     */
    Object.defineProperty(Object.prototype, "defineVariable", {
        value: function(name, val) {
            Object.defineProperty(this, name, {
                value: val,
                enumerable: true
            });
        }
    });
    
    
    /**
     * 関数定義
     * @function
     * @name    defineFunction
     * @param {Object} name
     * @param {Object} param
     * @methodOf    Object.prototype
     */
    Object.defineProperty(Object.prototype, "defineFunction", {
        value: function(name, fn) {
            Object.defineProperty(this, name, {
                value: fn,
                enumerable: false
            });
        }
    });
    
    
    /**
     * メンバ変数(フィールド)定義
     * @function
     * @name    defineInstanceVariable
     * @param {Object} name
     * @param {Object} param
     * @methodOf    Object.prototype
     */
    Object.prototype.defineFunction("defineInstanceVariable", function(name, val){
        Object.defineProperty(this.prototype, name, {
            value: val,
            enumerable: true
        });
    });
    
    
    /**
     * メンバ関数(メソッド)定義
     * @function
     * @name    defineInstanceMethod
     * @param {Object} name
     * @param {Object} param
     * @methodOf    Object.prototype
     */
    Object.prototype.defineFunction("defineInstanceMethod", function(name, fn){
        Object.defineProperty(this.prototype, name, {
            value: fn,
            enumerable: false
        });
    });
    
    /**
     * セッター
     * @function
     * @name    setter
     * @param {Object} name
     * @param {Object} param
     * @methodOf    Object.prototype
     */
    Object.defineInstanceMethod("setter", function(name, fn){
        Object.defineProperty(this, name, {
            set: fn,
            enumerable: false
        });
        // this.__defineSetter__(name, fn);
    });
    
    /**
     * ゲッター
     * @function
     * @name    getter
     * @param {Object} name
     * @param {Object} param
     * @methodOf    Object.prototype
     */
    Object.defineInstanceMethod("getter", function(name, fn){
        Object.defineProperty(this, name, {
            get: fn,
            enumerable: false
        });
        // this.__defineGetter__(name, fn);
    });
    
    /**
     * C#っぽいアクセッサ定義
     * @name    accessor
     * @param   {Object} name
     * @param   {Object} param
     * @methodOf    Object.prototype
     */
    Object.defineInstanceMethod("accessor", function(name, param)
    {
        Object.defineProperty(this, name, {
            set: param["set"],
            get: param["get"],
            enumerable: false
        });
        // (param["get"]) && this.getter(name, param["get"]);
        // (param["set"]) && this.setter(name, param["set"]);
    });
    
    
    /**
     * 自分自身を拡張
     */
    Object.defineInstanceMethod("extend", function() {
        for (var i=0,len=arguments.length; i<len; ++i) {
            var source = arguments[i];
            for (var property in source) {
                this[property] = source[property];
            }
        }
        return this;
    });

})();

/*
 * Core
 */
(function(){
    
    /** @lends TM */
    TM = {
        /**
         * バージョン
         */
        version : "0.0.0",
        
        /**
         * ライブラリのルートパス
         */
        libRoot : (function(){
            var scripts = document.getElementsByTagName("script");
            for (var i=0; i<scripts.length; ++i) {
                var match = scripts[i].src.match(/(^|.*)\/tmlib.js$/);
                if (match) return match[1];
            }
        })(),
        
        /**
         * ブラウザ
         * @see <a href="http://javanie.blog28.fc2.com/blog-entry-50.html">reference</a>
         */
        browser: (function(){
            if      (/chrome/i.test(navigator.userAgent))   { return "Chrome";  }
            else if (/safari/i.test(navigator.userAgent))   { return "Safari";  }
            else if (/firefox/i.test(navigator.userAgent))  { return "Firefox"; }
            else if (/opera/i.test(navigator.userAgent))    { return "Opera";   }
            else if (/getcko/i.test(navigator.userAgent))   { return "Getcko";  }
            else if (/msie/i.test(navigator.userAgent))     { return "IE";      }
            else { return null; }
        })(),
        
        /**
         * モバイルかどうかのフラグ
         */
        isMobile: (function(){
            return (navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("Android") > 0);
        })(),
        
        /**
         * 拡張
         * @param {Object} dest
         * @param {Object} source
         */
        extend: function(dest, source) {
            // var obj = {};
//             
            // obj.extend.apply(obj, arguments);
            // console.dir(obj);
//             
            // return obj;
            for (var property in source) {
                dest[property] = source[property];
            }
            return dest;
        },
        
        /**
         * 安全拡張
         * すでにあるものは変更しない
         * @param {Object} dest
         * @param {Object} source
         */
        extendSafety: function(dest, source) {
            for (var property in source) {
                if (!dest[property]) {
                    dest[property] = source[property];
                }
            }
            return dest;
        },
        
        /**
         * 厳格拡張
         * すでにあった場合は警告を出す
         * @param {Object} dest
         * @param {Object} source
         */
        extendStrict: function(dest, source) {
            for (var property in source) {
                console.assert(!dest[property], "TM Error: {0} is Already".format(property));
                // if (dest[property]) {
                    // console.error("TM Error: {0} is Already".format(property));
                // }
                dest[property] = source[property];
            }
        },
        
        /**
         * 拡張可能かをチェック
         * @param {Object} dest
         * @param {Object} source
         */
        canExtend: function(dest, source) {
            for (var property in source) {
                if (dest[property]) {
                    return false;
                }
            }
            return true;
        },
        
        /**
         * クラス生成.
         * superClass があった場合は継承する.
         * @param {Object} prop
         * @example
         * // SuperHoge というクラスを作成
         * var SuperHoge = TM.createClass({
         *     // コンストラクタ. init という名前である必要があります.
         *     init: function(name) {
         *         this.name = name;
         *         
         *         console.log("---- create SuperHoge ----");
         *     },
         *     
         *     test: function() {
         *         console.log("My name is {name}.".format(this));
         *     }
         * });
         * // SuperHoge を生成(createClass で定義すると new はいらないよん♪)
         * var hoge = SuperHoge("phi");
         * hoge.test();
         * 
         * 
         * 
         * 
         * // SuperHoge を継承して SubHoge クラスを作成
         * var SubHoge = TM.createClass({
         *     
         *     // 継承元となるクラスを指定. superClass という名前である必要があります.
         *     superClass: SuperHoge,
         *     
         *     // コンストラクタ
         *     init: function(name, bloodType) {
         *         // 親のコンストラクタを呼ぶ
         *         this.superInit(SuperHoge, name);
         *         this.bloodType = bloodType;
         *         
         *         console.log("---- create SubHoge ----");
         *     },
         *     
         *     test: function() {
         *         console.log("My name is {name}.".format(this));
         *         console.log("My blood type is {bloodType}.".format(this));
         *     }
         * });
         * 
         * @see <a href="http://tmlib-js.googlecode.com/svn/trunk/test/tmlib-test.html">Test Program</a>.
         */
        createClass: function(prop) {
            var DEFAULT = {
                init: function() {},
                superClass: null
            };
            
            var data = TM.extend(DEFAULT, prop);
            
            var tm_class = function(){
                var temp = new tm_class.prototype.creator();
                
                // if (temp.superInit) {
                    // temp.superInit.apply(temp, arguments);
                // }
                tm_class.prototype.init.apply(temp, arguments);
                
                return temp;
            };
            
            if (data.superClass) {
                tm_class.prototype = Object.create(data.superClass.prototype);
                tm_class.superInit = data.superClass.prototype.init;
                tm_class.prototype.superInit = function(superClass) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    superClass.prototype.init.apply(this, args);
                    return this;
                };
            }
            TM.extend(tm_class.prototype, data);
            
            /*
            if (data.superClass) {
                // 
                tm_class.prototype.__proto__ = data.superClass.prototype;
                // TM.extend(tm_class.prototype, data.superClass.prototype);
                tm_class.prototype.superInit = data.superClass.prototype.init;
                tm_class.superInit = data.superClass.prototype.init;
            }
            
            // メソッド登録
            TM.extend(tm_class.prototype, data);
            */
            
            // クリエイタの生成 & 継承
            tm_class.prototype.creator = function() { return this; }
            tm_class.prototype.creator.prototype = tm_class.prototype;
            
            return tm_class;
        },
        
        setLoop: function(fn, delay)
        {
            var temp = function() {
                fn();
                setTimeout(arguments.callee, delay);
            };
            setTimeout(temp, delay);
        },
        
        /**
         * 範囲指定版 random 関数(int)
         * @param   {Number}    min 最小値.
         * @param   {Number}    max 最大値.
         */
        random: function(min, max)
        {
            return window.Math.floor( TM.randomf(min, max) );
        },
        
        /**
         * 範囲指定版 random 関数(float)
         * @param   {Number}    min 最小値.
         * @param   {Number}    max 最大値.
         */
        randomf: function(min, max)
        {
            return window.Math.random()*(max-min)+min;
        },
        

        sparking: function(namespace)
        {
            namespace = namespace || window;
            TM.main(function(){
                TM.extend(namespace, TM);
                // TM.extendStrict(namespace, TM);
                // if (TM.canExtend(namespace, TM)) { TM.extendStrict(namespace, TM); }
            });
        },
        using: function(namespace)
        {
            namespace = namespace || window;
            TM.main(function(){
                TM.extendSafety(namespace, TM);
                // TM.extendStrict(namespace, TM);
                // TM.extendStrict(namespace, TM);
                // if (TM.canExtend(namespace, TM)) { TM.extendStrict(namespace, TM); }
            });
        },
        
        /**
         * グローバル領域.
         * ご自由にお使い下さい.
         * @type    Object
         */
        global: {}
        
    };
    
    TM.extend(TM, {
        /**
         * ベンダープレフィックス
         */
        venderPrefix: (function(){
            switch (TM.browser) {
                case "Chrome"   :
                case "Safari"   : return "webkit";
                case "Firefox"  : return "moz";
                case "Opera"    : return "o";
                case "IE"       : return "ms";
            }
        })()
    });
    
    
    window.tm = window.Tm = window.TM;
    
})();

/*
 * Object Extend
 */
(function(){
    
    
    /**
     * 
     */
    Object.defineInstanceMethod("toTableElement", function(){
        // TODO: 
    });
    
    Object.defineInstanceMethod("$log", function(top_str, end_str) {
        top_str = top_str || "";
        end_str = end_str || "";
        console.log(top_str + this.toString() + end_str);
    });
    
    Object.defineInstanceMethod("$dir", function(top_str, end_str) {
        top_str && console.log(top_str);
        console.dir(this);
        end_str && console.log(end_str);
    });
    
})();


/*
 * Number Extend
 */
(function(){
    
    /**
     * 四捨五入.
     * 桁数指定版.
     * @return      {Number}    result
     */
    Number.prototype.round = function(figure) {
        figure = figure || 0;
        var base = Math.pow(10, figure);
        var temp = this * base;
        temp = Math.round(temp);
        return temp/base;
    };
    
    /**
     * 切り上げ.
     * 桁数指定版.
     * @return      {Number}    result
     */
    Number.prototype.ceil = function(figure) {
        figure = figure || 0;
        var base = Math.pow(10, figure);
        var temp = this * base;
        temp = Math.ceil(temp);
        return temp/base;
    };
    /**
     * 切り捨て.
     * 桁数指定版.
     * @return      {Number}    result
     */
    Number.prototype.floor = function(figure) {
        figure = figure || 0;
        var base = Math.pow(10, figure);
        var temp = this * base;
        temp = Math.floor(temp);
        return temp/base;
    };
    
    /**
     * 
     * @return      {Number}    result
     */
    Number.prototype.toInt = function() {
        return (this | 0);
    };
    
    /**
     * unsigned 型に変換する
     */
    Number.prototype.toUnsigned = function() {
        return this >>> 0;
    };
    
    /**
     * 16進数化
     */
    Number.prototype.toHex = function() {
        return this.toString(16);
    };
    
    /**
     * 2進数化
     */
    Number.prototype.toBin = function() {
        return this.toString(2);
    };
    
    
    /**
     * 文字埋め
     */
    Number.prototype.padding = function(n, ch) {
        var str = this+'';
        n  = n-str.length;
        ch = ch || '0';
        
        while(n-- > 0) { str = ch + str; }
        
        return str;
    };
    
})();


/*
 * String Extend
 */
(function(){
    
    /**
     * フォーマット
     * @function
     * @example
     * document.write("{0} + {1} = {2}".format(5, 10, 5+10));   // "5 + 10 = 15"
     * document.write("rgb({r}, {g}, {b})".format({             // "rgb(128, 0, 255)"
     *     r: 128,
     *     g: 0,
     *     b: 255
     * }));
     */
    String.prototype.format = function(arg)
    {
        // 置換ファンク
        var rep_fn = undefined;
        
        // オブジェクトの場合
        if (typeof arg == "object") {
            /** @ignore */
            rep_fn = function(m, k) { return arg[k]; }
        }
        // 複数引数だった場合
        else {
            var args = arguments;
            /** @ignore */
            rep_fn = function(m, k) { return args[ parseInt(k) ]; }
        }
        
        return this.replace( /\{(\w+)\}/g, rep_fn );
    };
    
    /**
     * トリム
     * @see     <a href="http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/">Reference</a>
     * 
     */
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
    };
    
    /**
     * キャピタライズ
     * @see     <ul>
     *              <li><a href="http://d.hatena.ne.jp/brazil/20051212/1134369083">Reference</a></li>
     *              <li><a href="http://design-program.blogspot.com/2011/02/javascript.html">Reference</a></li>
     *          </ul>
     */
    String.prototype.capitalize = function() {
        return this.replace(/\w+/g, function(word){
            return word.capitalizeFirstLetter();
        });
    };
    
    /**
     * 先頭文字のみキャピタライズ
     */
    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
    };
    
    /**
     * ダッシュ
     */
    String.prototype.toDash = function() {
        return this.replace(/([A-Z])/g, function(m){ return '-'+m.toLowerCase(); });
    }
    
    /**
     * CRC32 変換
     */
    String.prototype.toCRC32 = function() {
        return TM.crc32(this);
    };
    
    /**
     * ハッシュ値に変換
     */
    String.prototype.toHash= function() {
        return TM.crc32(this);
    };
    
    /**
     * 左側に指定された文字を詰めて右寄せにする
     */
    String.prototype.padding = function(n, ch) {
        var str = this.toString();
        n  = n-str.length;
        ch = ch || ' ';
        
        while(n-- > 0) { str = ch + str; }
        
        return str;
    };
    
    /**
     * 左側に指定された文字を詰めて右寄せにする
     */
    String.prototype.paddingLeft = String.prototype.padding;
    
    /**
     * 右側に指定された文字を詰めて左寄せにする
     */
    String.prototype.paddingRight = function(n, ch) {
        var str = this.toString();
        n  = n-str.length;
        ch = ch || ' ';
        
        while(n-- > 0) { str = str + ch; }
        
        return str;
    };
    
    /**
     * リピート
     */
    String.prototype.repeat = function(n) {
        // TODO: 確認する
        var arr = Array(n);
        for (var i=0; i<n; ++i) arr[i] = this;
        return arr.join('');
    };
    
})();

/*
 * Array Extend
 */
(function(){
    
    /**
     * a番目 と b番目 を入れ替える
     */
    Array.defineInstanceMethod("swap", function(a, b) {
        var temp = this[a];
        this[a] = this[b];
        this[b] = temp;
        return this;
    });
    
    /**
     * elm と一致する要素を削除
     */
    Array.defineInstanceMethod("erase", function(elm) {
        var index  = this.indexOf(elm);
        this.splice(index, 1);
        return this;
    });
    
    /**
     * elm と一致する要素を全て削除
     */
    Array.defineInstanceMethod("eraseAll", function(elm) {
        for (var i=0,len=this.length; i<len; ++i) {
            if (this[i] == elm) {
                this.splice(i--, 1);
            }
        }
        return this;
    });
    
    /**
     * 条件にマッチした要素を削除
     */
    Array.defineInstanceMethod("eraseIf", function(fn) {
        for (var i=0,len=this.length; i<len; ++i) {
            if ( fn(this[i], i, this) ) { this.splice(i--, 1); }
        }
        return this;
    });
    
    /**
     * 要素の中からランダムで取り出す
     */
    Array.defineInstanceMethod("random", function(min, max) {
        min = min || 0;
        max = max || this.length;
        return this[ TM.random(min, max) ];
    });
    
    
    /**
     * 重複削除
     */
    Array.defineInstanceMethod("uniq", function(deep) {
        var arr = [];
        for (var i=0,len=this.length; i<len; ++i) {
            var value = this[i];
            if (value in arr == false) {
                arr.push(value);
            }
        }
        return arr;
    });
    
    /**
     * フラット.
     * Ruby のやつ.
     */
    Array.defineInstanceMethod("flatten", function(deep) {
        var arr = [];
        for (var i=0,len=this.length; i<len; ++i) {
            var value = this[i];
            if (value instanceof Array) {
                arr = arr.concat(value.flatten());
            }
            else {
                arr.push(value);
            }
        }
        return arr;
    });
    
    /**
     * 配列をクローン
     */
    Array.defineInstanceMethod("clone", function(deep) {
        if (deep == true) {
            var a = Array(this.length);
            for (var i=0,len=this.length; i<len; ++i) {
                a[i] = (this[i].clone) ? this[i].clone(deep) : this[i];
            }
            return a;
        };
        
        return Array.prototype.slice.apply(this);
    });
    
    /**
     * クリア
     */
    Array.defineInstanceMethod("clear", function() {
        this.length = 0;
        return this;
    });
    
    /**
     * 特定の値で満たす
     */
    Array.defineInstanceMethod("fill", function() {
        // TODO:
        return this;
    });
    
    /**
     * 
     */
    Array.defineInstanceMethod("toULElement", function(){
        // TODO: 
    });

    /**
     * 
     */
    Array.defineInstanceMethod("toLIElement", function(){
        // TODO:
    });
    
})();


/*
 * Function Extend
 */
(function(){
    
    
    /**
     * 関数を配列対応関数に変換.
     * forEach の逆アプローチ的な感じ.
     * 配列を継承したクラスなどに使用する.
     * @example
     * var hoge = function(n) { console.log(this*n); return this*n; };
     * var arr = [5, 10, 15];
     * arr.hogeArray = hoge.toArrayFunction();
     * var result = arr.hogeArray(100);
     * console.log(result);
     */
    Function.defineInstanceMethod("toArrayFunction", function() {
        var self = this;
        return function() {
            var resultList = [];
            for (var i=0,len=this.length; i<len; ++i) {
                resultList.push( self.apply(this[i], arguments) );
            }
            return resultList;
        }
    });
    
    
    // forEach や map はもう標準化されてきてるので実装しないよん♪
    
})();



/*
 * DOM
 */
(function(){
    
    /** @lends TM */
    TM.extend(TM, {
        /**
         * id の一致する要素を取得.
         * document.getElementById の Alias.
         * @param   {String}    id  id.
         */
        $id: function(id) {
            return document.getElementById(id);
        },
        
        /**
         * class 名の一致する要素リストの index(デフォルトは0) 番目の要素を取得.
         * document.getElementsByClassName の Alias.
         * @param   {String}    className   class name.
         * @param   {Number}    index       element index.
         */
        $class: function(className, index) {
            return (index) ?
                document.getElementsByClassName(className)[index] :
                document.getElementsByClassName(className)[0];
        },
        
        /**
         * class 名の一致する要素リストを取得.
         * document.getElementsByClassName の Alias.
         * @param   {String}    className   class name.
         */
        $classAll: function(className) {
            return document.getElementsByClassName(className);
        },
        
        /**
         * class 名の一致する要素リストを取得.
         * document.getElementsByClassName の Alias.
         * @param   {String}    className   class name.
         */
        $classes: function(className) {
            return document.getElementsByClassName(className);
        },
        
        /**
         * css セレクタの一致する要素リストの index 番目の要素を取得.
         * document.querySelector の Alias.
         */
        $query: function(query, index) {
            return (index) ?
                document.querySelectorAll(query)[index] : 
                document.querySelector(query);
        },
        
        /**
         * css セレクタの一致する要素リストを取得.
         * document.querySelectorAll の Alias.
         */
        $queryAll: function(query) {
            return document.querySelectorAll(query);
        },
        
        /**
         * tagName 要素を生成する.
         * document.createElement の Alias.
         */
        $create: function(tagName)
        {
            return document.createElement(tagName);
        },
        

        /**
         * ドキュメントに書き込む.
         * document.write の Alias
         */
        $write: function(str) {
            document.write(str);
        },
        
        /**
         * 要素をセンタリングする
         */
        $centering: function(elm) {
            with(elm.style) {
                position = "absolute";
                left = top = right = bottom = "0px";
                margin = "auto";
            }
            return this;
        }
    });
    
    // innerText 対応 ( moz では textContent なので innerText に統一 )
    var temp = TM.$create("div");
    if (temp.innerText === undefined) {
        HTMLElement.prototype.accessor("innerText", {
            "get": function()   { return this.textContent; },
            "set": function(d)  { this.textContent = d; }
        });
    }
    
})();

/*
 * イベント拡張
 */
(function(){
    
    /**
     * イベント
     * @class   Event
     * @name    Event
     */
    Event = Event || {};
    
    // 仕方なしの IE 対応(これ引っかかったら他のもダメだから必要ないかも)
    if (!Event.prototype.stopPropagation) {
        Event.prototype.stopPropagation = function() {
            this.cancelBubble = true;
        };
    }
    if (!Event.prototype.preventDefault) {
        Event.prototype.preventDefault = function() {
            this.returnValue = false;
        };
    }
    
    /**
     * イベントのデフォルト処理 & 伝達を止める
     * @methodOf    Event.prototype
     */
    Event.prototype.stop = function() {
        // イベントキャンセル
        this.preventDefault();
        // イベント伝達を止める
        this.stopPropagation();
    };
    
    /**
     * キーボードイベント
     * @class   KeyboardEvent
     */
    KeyboardEvent = KeyboardEvent || {};
    
    /**
     * 押したキーの文字を取得
     * @name    character
     * @fieldof KeyboardEvent.prototype
     */
    KeyboardEvent.prototype.getter("character", function(){
        return String.fromCharCode(this.keyCode);
    });
    
    
    /**
     * マウスイベント
     */
    MouseEvent = MouseEvent || {};
    
    /**
     * マウスのX座標.
     * @name    pointX
     * @fieldof MouseEvent.prototype
     */
    MouseEvent.prototype.getter("pointX", function() {
        return this.clientX - this.target.getBoundingClientRect().left;
    });
    
    /**
     * マウスのY座標.
     * @name    pointY
     * @fieldof MouseEvent.prototype
     */
    MouseEvent.prototype.getter("pointY", function() {
        return this.clientY - this.target.getBoundingClientRect().top;
    });
    
    /**
     * タッチイベント
     */
    if (window.TouchEvent != undefined) {
        /**
         * タッチ
         * @name    TouchEvent
         * @class
         */
        TouchEvent;
        
        /**
         * タッチイベント.
         * @name    pointX
         * @fieldof TouchEvent.prototype
         */
        TouchEvent.prototype.getter("pointX", function() {
            return this.touches[0].pageX;
        });
        
        /**
         * タッチイベント.
         * @name    pointY
         * @fieldof TouchEvent.prototype
         */
        TouchEvent.prototype.getter("pointY", function() {
            return this.touches[0].pageY;
        });
    }
    
    
})();


/*
 * スクリプト動的ロード
 */
(function(){
    
    /** @lends TM */
    TM.extend(TM, {
        /**
         * ネームスペースリスト
         */
        namespaceList: {
            /** ルート */
            "root"      : TM.libRoot,
            
            "util"      : TM.libRoot + '/util',
            "math"      : TM.libRoot + '/math',
            "geom"      : TM.libRoot + '/geom',
            "collision" : TM.libRoot + '/collision',
            "input"     : TM.libRoot + "/input",
            "dom"       : TM.libRoot + '/dom',
            "graphics"  : TM.libRoot + '/graphics',
            "app"       : TM.libRoot + '/app',
            "data"      : TM.libRoot + '/data',
            
            "user"      : "."
        },
        
        scriptList: {},
        
        addNamespace: function(namespace, path)
        {
            TM.namespaceList[namespace] = path;
        },
        
        loadScript: function(namespace, name, callback)
        {
            name = name || namespace;
            
            var _callback = (function(name, callback) {
                return function() {
                    var script = TM.scriptList[name];
                    if (callback) {
                        var result = callback(script);
                        // コールバックの返り値が false だった場合, スクリプトをロックして自分を再帰的に実行する
                        if (result === false) {
                            script.locked = true;
                            setTimeout(arguments.callee, 0);
                            return ;
                        }
                    }
                    script.locked = false;
                };
            })(name, callback);
            
            if (TM.scriptList[name] === undefined) {
                var script = TM.scriptList[name] = {
                    "name"      : name,
                    "src"       : TM.namespaceList[namespace]+"/tm."+name+".js",
                    "loaded"    : false,
                    "locked"    : false,
                    "element"   : null
                };
                // ロード
                script.element  = document.createElement("script");
                script.element.type    = "text/javascript";
                script.element.charaset= "UTF-8";
                script.element.src     = script.src;
                script.element.setAttribute("defer", true);
                document.getElementsByTagName("head")[0].appendChild(script.element);
                // コールバック
                script.element.addEventListener("load", function(){
                    // if (_isDOMReady==false) setTimeout(arguments.callee, 0);
                    _callback();
                    script.loaded = true;
                }, false);
            }
            else if (TM.scriptList[name].loaded === false) {
                TM.scriptList[name].element.addEventListener("load", function(){
                    _callback();
                }, false);
            }
            else {
                _callback();
            }
        },
        
        loadUserScript: function(namespace, name, callback)
        {
            name = name || namespace;
            
            if (TM.scriptList[name] === undefined) {
                var script = TM.scriptList[name] = {
                    "name"      : name,
                    "src"       : TM.namespaceList[namespace]+"/"+name+".js",
                    "loaded"    : false,
                    "element"   : null
                };
                // ロード
                script.element  = document.createElement("script");
                script.element.type    = "text/javascript";
                script.element.charaset= "UTF-8";
                script.element.src     = script.src;
                script.element.setAttribute("defer", true);
                document.getElementsByTagName("head")[0].appendChild(script.element);
                // コールバック
                script.element.addEventListener("load", function(){
                    // if (_isDOMReady==false) setTimeout(arguments.callee, 0);
                    if (callback) callback(script);
                    script.loaded = true;
                }, false);
            }
            else if (TM.scriptList[name].loaded === false) {
                TM.scriptList[name].element.addEventListener("load", function(){
                    if (callback) callback(TM.scriptList[name]);
                }, false);
            }
            else {
                if (callback) callback(TM.scriptList[name]);
            }
        },
        
        styleSheetList: [],
        
        loadStyleSheet: function(namespace, name)
        {
            var eLink = document.createElement("link");
            
            eLink.rel = "stylesheet";
            eLink.href= TM.namespaceList[namespace]+"/"+name+".css";
            document.getElementsByTagName("head")[0].appendChild(eLink);
        },
        
        
        /**
         * dat gui
         */
        loadDatGUI: function()
        {
            TM.loadStyleSheet("dat-gui", "gui");
            TM.loadUserScript("dat-gui", "gui", function(){
                TM.loadUserScript("dat-gui", "controllers/slider");
                TM.loadUserScript("dat-gui", "controllers/controller");
                TM.loadUserScript("dat-gui", "controllers/controller.boolean");
                TM.loadUserScript("dat-gui", "controllers/controller.function");
                TM.loadUserScript("dat-gui", "controllers/controller.number");
                TM.loadUserScript("dat-gui", "controllers/controller.string");
            });
        },
        
        
        /**
         * dat gui
         */
        loadStats: function()
        {
            TM.loadUserScript("stats", "Stats");
        },

        /**
         * 
         */
        loadPrettify: function()
        {
            TM.loadStyleSheet("prettify", "prettify");
            TM.loadUserScript("prettify", "prettify");
        }
        
        
    });
    
    // dom 読み込みチェック
    var _isDOMReady = false;
    var _checkDOMReady = function(){
        // dom 読み込みチェック
        if (_isDOMReady === false) {
            document.addEventListener("DOMContentLoaded", function(){
                _isDOMReady = true;
                _checkScriptReady();
            }, false);
        }
        else {
            _checkScriptReady();
        }
    };
    
    // スクリプトのロードチェック
    var _checkScriptReady = function(){
        var flag = true;
        // チェック
        for (var key in TM.scriptList) {
            if (TM.scriptList[key].loaded === false) {
                flag = false; break;
            }
            if (TM.scriptList[key].locked === true) {
                flag = false; break;
            }
        }
        // false のときは自身を呼ぶ. true のままだった場合は次のステップに移る
        (flag===false) ? setTimeout(arguments.callee, 0) : _checkReady();
    };
    
    // 全体チェック
    var _checkReady = function(fn) {
        // 登録されていた main 関数を全て実行
        for (var i=0; i<TM.mainFuncList.length; ++i) {
            TM.mainFuncList[i]();
        }
        // クリア
        TM.mainFuncList = [];
    }
    
    TM.mainFuncList = [];
    
    /**
     * メイン処理. jQuery の ready 的な使い方.
     * C/C++ でいう int main() { ... } にあたる.
     * 複数登録可能.
     */
    TM.main = function(fn) {
        // 
        TM.mainFuncList.push(fn);
        // 
        _checkDOMReady();
    };
    
})();


/*
 * keycode
 */
(function(){
    
    /**
     * ホットキー.
     * hotkeys → KeyCode もしくは　KEY_CODE に置き換える
     * @ref     http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/Javascript-Char-Codes-Key-Codes.aspx
     *          
     */
    TM.hotkeys = TM.KeyCode = {
        "backspace" : 8,
        "tab"       : 9,
        "enter"     : 13, "return"    : 13,
        "shift"     : 16,
        "ctrl"      : 17,
        "alt"       : 18,
        "pause"     : 19,
        "capslock"  : 20,
        "escape"    : 27,
        "pageup"    : 33,
        "pagedown"  : 34,
        "end"       : 35,
        "home"      : 36,
        "left"      : 37,
        "up"        : 38,
        "right"     : 39,
        "down"      : 40,
        "insert"    : 45,
        "delete"    : 46,
        
        "0" : 48,
        "1" : 49,
        "2" : 50,
        "3" : 51,
        "4" : 52,
        "5" : 53,
        "6" : 54,
        "7" : 55,
        "8" : 56,
        "9" : 57,
        
        "a" : 65, "A" : 65,
        "b" : 66, "B" : 66,
        "c" : 67, "C" : 67,
        "d" : 68, "D" : 68,
        "e" : 69, "E" : 69,
        "f" : 70, "F" : 70,
        "g" : 71, "G" : 71,
        "h" : 72, "H" : 72,
        "i" : 73, "I" : 73,
        "j" : 74, "J" : 74,
        "k" : 75, "K" : 75,
        "l" : 76, "L" : 76,
        "m" : 77, "M" : 77,
        "n" : 78, "N" : 78,
        "o" : 79, "O" : 79,
        "p" : 80, "P" : 80,
        "q" : 81, "Q" : 81,
        "r" : 82, "R" : 82,
        "s" : 83, "S" : 83,
        "t" : 84, "T" : 84,
        "u" : 85, "U" : 85,
        "v" : 86, "V" : 86,
        "w" : 87, "W" : 87,
        "x" : 88, "X" : 88,
        "y" : 89, "Y" : 89,
        "z" : 90, "Z" : 90,
        
        "numpad0" : 96,
        "numpad1" : 97,
        "numpad2" : 98,
        "numpad3" : 99,
        "numpad4" : 100,
        "numpad5" : 101,
        "numpad6" : 102,
        "numpad7" : 103,
        "numpad8" : 104,
        "numpad9" : 105,
        "multiply"      : 106,
        "add"           : 107,
        "subtract"      : 109,
        "decimalpoint"  : 110,
        "divide"        : 111,
        
        "f1"    : 112,
        "f2"    : 113,
        "f3"    : 114,
        "f4"    : 115,
        "f5"    : 116,
        "f6"    : 117,
        "f7"    : 118,
        "f8"    : 119,
        "f9"    : 120,
        "f10"   : 121,
        "f11"   : 122,
        "f12"   : 123,
        
        "numlock"   : 144,
        "scrolllock": 145,
        "semicolon" : 186,
        "equalsign" : 187,
        "comma"     : 188,
        "dash"      : 189,
        "period"    : 190,
        "forward slash" : 191,  "/": 191,
        "grave accent"  : 192,
        "open bracket"  : 219,
        "back slash"    : 220,
        "close braket"  : 221,
        "single quote"  : 222,
        
        
        
        "space"         : 32
    };
    
    TM.KeyCode = TM.hotkeys;
    
})();


/*
 * Extend Date
 */
(function(){
    
    /*
    TM.Date = TM.createClass({
        superClass: Date,
        
        init: function() {
            
        },
        
        format: function() {
            return "abc";
        },
        
        toString: function() {
            return Date.toString.call(this);
        }
    });
    */
    
    var MONTH = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    
    var WEEK = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    
    Date.prototype.format = function(pattern)
    {
        /*
        var str = "{y}/{m}/{d}".format({
            y: this.getYear()+1900,
            m: this.getMonth()+1,
            d: this.getDate(),
        });
        
        return str;
        */
        
        var year    = this.getFullYear();
        var month   = this.getMonth();
        var date    = this.getDate();
        var day     = this.getDay();
        var hours   = this.getHours();
        var minutes = this.getMinutes();
        var seconds = this.getSeconds();
        var str = "";
        
        for (var i=0,len=pattern.length; i<len; ++i) {
            var ch = pattern.charAt(i);
            var temp = "";
            switch(ch) {
                // 日
                case "d": temp = date.padding(2, '0'); break;
                case "D": temp = WEEK[day].substr(0, 3); break;
                case "j": temp = date; break;
                case "l": temp = WEEK[day]; break;
                // case "N": temp = ; break;
                // case "S": temp = ; break;
                // case "w": temp = ; break;
                // case "z": temp = ; break;
                
                // 月
                case "F": temp = MONTH[month]; break;
                case "m": temp = (month+1).padding(2, '0'); break;
                case "M": temp = MONTH[month].substr(0, 3); break;
                case "n": temp = (month+1); break;
                // case "t": temp = (month+1); break;
                
                // 年
                // case "L": temp = ; break;
                // case "o": temp = ; break;
                case "Y": temp = year; break;
                case "y": temp = year.toString().substr(2, 2); break;
                
                
                // 時間
                // case "a": temp = ; break;
                // case "A": temp = ; break;
                // case "B": temp = ; break;
                // case "g": temp = ; break;
                case "G": temp = hours; break;
                // case "h": temp = ; break;
                case "H": temp = hours.padding(2, '0'); break;
                case "i": temp = minutes.padding(2, '0'); break;
                case "s": temp = seconds.padding(2, '0'); break;
                
                default : temp = ch; break;
            }
            str += temp;
        }
        return str;
    };
    
    /*
    var date = new Date("2009/1/2");
    alert(date.format("Y:y | m:n:F:M | d:j | l:D | H:i:s"));
    */
    
    // alert(date.format("Y/m/d | y/n/d"));
    
    
    // TM.Date = TM.createClass({
        // superClass: Date,
//         
        // init: function() {
            // Date.call(this, "2008/10/11");
        // },
//         
        // getDate: function() {
            // console.dir(this);
            // return this.__proto__.getMonth();
            // return Date.prototype.getDate.apply(this.__proto__.__proto__);
        // }
    // });
//     
    // var date = TM.Date();
    // console.dir(date.getDate());
    
})();


/*
 * crc 変換
 */
(function(){
    
    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D".split(' ');
    
    /**
     * crc32 変換
     * @example
     * var crc = TM.crc32("hoge");
     * if (crc == TM>crc32("hoge")) {
     *     // 比較高速化
     * }
     */
    TM.crc32 = function(str){
        var crc = 0, x=0, y=0;
        
        crc = crc ^ (-1);
        for (var i=0, iTop=str.length; i<iTop; ++i) {
            y = (crc ^ str.charCodeAt(i)) & 0xff;
            x = "0x" + table[y];
            crc = (crc >>> 8) ^ x;
        }
        
        return (crc ^ (-1)) >>> 0;
    };
})();


/*
 * debug 用コンソール
 */
(function(){
    
    /**
     * デバッグ用コンソール. 標準である console の dom 版.
     */
    TM.DebugConsole = TM.createClass({
        
        element: null,
        indent: "",
        
        init: function(arg) {
            if (typeof arg == "string") {
                this.element = TM.$query(arg);
            }
            else {
                this.element = arg;
            }
            this.element.style.whiteSpace = "pre";
        },
        
        clear: function() {
            this.element.innerHTML = "";
            return this;
        },
        
        log: function() {
            var str = Array.prototype.join.call(arguments, ' ');
            str = str.split('\n').join('\n    ');
            this.element.innerHTML += this.indent + str + '\n';
            return this;
        },
        
        group: function(name) {
            this.element.innerHTML += "<p>{0}</p>".format(name);
            this.indent += "    ";
            return this;
        },
        
        groupEnd: function() {
            this.indent = "";
        }
        
    });
    
})();


/*
 * information 表示
 */
(function(){
    
    TM.inform = function(parent){
        parent = parent || document.body;
        
        var eInfo = TM.$create("div");
        eInfo.setAttribute("class", "tm-info");
        eInfo.addEventListener("mouseover", function(){
            this.style.opacity = 0.9;
        }, false);
        eInfo.addEventListener("mouseout", function(){
            this.style.opacity = 0.25;
        }, false);
        
        with(eInfo.style) {
            position    = "absolute";
            width       = "100%";
            top         = "0px";
            left        = "0px";
            right       = "0px";
            margin      = "0px";
            padding     = "10px 0px";
            zIndex      = "0";
            textAlign   = "center";
            fontFamily  = '"Meiryo", "メイリオ", "ヒラギノ角ゴ Pro W3", sans-serif';
            fontSize    = "13px";
            opacity     = "0.25";
            backgroundColor = "rgb(230,230,255)";
            background  = "-webkit-linear-gradient(top, hsla(0, 100%, 100%, 0.8) 0%, hsla(0, 100%, 100%, 0.3) 50%, hsla(0, 100%, 100%, 0.1) 51%, hsla(0, 100%, 100%, 0.2) 100%), rgb(190,190,210)";
            background  = "-moz-linear-gradient(top, hsla(0, 100%, 100%, 0.8) 0%, hsla(0, 100%, 100%, 0.3) 50%, hsla(0, 100%, 100%, 0.1) 51%, hsla(0, 100%, 100%, 0.2) 100%), rgb(190,190,210)";
            WebkitTransition = "1s";
            MozTransition = "1s";
        }
        
        /*
        eInfo.innerHTML = "このプログラムで利用している JavaScript ライブラリ 『tmlib.js』 は<a href='{tmlibLink}'>こちら</a>からダウンロードできます. 詳しくは<a href='{blogLink}'>Blog</a>に書いています.".format({
            "tmlibLink": "http://code.google.com/p/tmlib-js/downloads/list",
            "blogLink" : "http://tmlife.net/tmlib"
        });
        */
        eInfo.innerHTML = "このプログラムで利用している JavaScript ライブラリ 『tmlib.js』 については<a href='{blogLink}'>こちら</a>.".format({
            "blogLink" : "http://tmlife.net/tmlib"
        });
        parent.appendChild(eInfo);
    }
    
})();



/*
 * 
 */
(function(){
    // TODO: ちゃんと整理する. JSON っぽく作ろうと検討中
    return ;
    
    TM.PARAM = {};
    
    /**
     * 文字列化
     */
    TM.PARAM.stringify = function() {
        
    };
    
    /**
     * オブジェクト化
     * http://archiva.jp/web/javascript/get_query-string.html
     */
    TM.PARAM.parse = function(query, delimiter, assign)
    {
        delimiter   = delimiter || '&';
        assign      = assign    || '=';
        
        var obj = {};
        var params = query.split(delimiter);
        for (var i=0,len=params.length; i<len; ++i) {
            var param = params[i];
            var pos = param.indexOf('=');
            if (pos>0) {
                var key = param.substring(0, pos);
                var val = param.substring(pos+1);
                obj[key] = val;
            }
        }
        return obj;
    };
    
    /**
     * Search or RequestParam or Query or Request or Question
     * get or parse
     */
    TM.PARAM.parseRequestParam =
    TM.PARAM.getRequestParam   =
    TM.PARAM.getQuery = function()
    {
        if (window.location.search) {
            var param = window.location.search.match(/\?(.+)#*/)[1];
            return TM.PARAM.parse(param);
        }
        return {};
    };
    
    TM.PARAM.getHash = function()
    {
        if (window.location.hash) {
            var param = window.location.hash.match(/#(.+)/)[1];
            return TM.PARAM.parse(param);
        }
        return {};
    };
    
    console.dir( TM.PARAM.getQuery() );
    console.dir( TM.PARAM.getHash() );
    
})();


































