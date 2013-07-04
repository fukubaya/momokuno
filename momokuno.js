/*
 * momokuno.js
 * 
 * Created by FUKUBAYASHI Yuichiro on 2013/07/01
 * Copyright (c) 2013, FUKUBAYASHI Yuichiro
 *
 * last update: <2013/07/05 00:42:28>
 */
MOMOKUNO = {};

(function(momokuno){
     // enum
     momokuno.types = {
	 SONG: 0,
	 MC : 1,
	 SW1H: 2 // 5W1H
     };
     
     // configuration
     momokuno.conf = {
	 timelimit : 3600,	// 制限時間 (s)
	 meetingtime : {	// 曲決め時間
	     mean : 615,	// 平均 (s)
	     sd : 60		// 標準偏差 (s)
	 },
	 mc : { 
	     time : 120		// MC時間 (s)
	 },
	 typelist : [
	     momokuno.types.SONG, // M1
	     momokuno.types.SONG, // M2
	     momokuno.types.SONG, // M3
	     momokuno.types.MC,   // MC
	     momokuno.types.SONG, // M4 (secret)
	     momokuno.types.SONG, // M5
	     momokuno.types.SONG, // M6
	     momokuno.types.MC,   // MC
	     momokuno.types.SW1H, // M7 (5W1H)
	     momokuno.types.SW1H, // M8 (5W1H)
	     momokuno.types.SONG, // M9
	     momokuno.types.SONG  // M10
	 ]
     };
     
     // Song
     function Song(title, abbr, time, p, solo_or_unit){
	 this.title = title;	// 正式名称
	 this.abbr = abbr;	// 省略名
	 this.time = time;	// 演奏時間 (s)
	 this.p = p === undefined ? 1.0 : p; // 採用確率 (0<p<1.0)
	 this.solo_or_unit = solo_or_unit === undefined ? false : solo_or_unit; // ソロ曲かユニット曲

	 this.getTitle  = function(n){
	     return "M" + n + ":" + this.title;
	 };

	 this.getAbbr = function(n){
	     return n + "" + this.abbr;	     
	 };
     }
     
     // Song with 5W1H
     function Song5W1H(song, members){
	 this.title = song.title;
	 this.abbr = song.abbr;
	 this.time = song.time;
	 this.p = song.p;
	 this.solo_or_unit = song.solo_or_unit;
	 this.members = members;

	 this.getTitle = function(n){
	     var member_list_text = [];
	     for(var i=0; i<this.members.length; i++){
		 member_list_text.push(this.members[i].name);
	     }
	     return song.getTitle(n)+"("+member_list_text.join(",")+")";
	 };
	 
	 this.getAbbr = function(n){
	     var member_list_text = [];
	     for(var i=0; i<this.members.length; i++){
		 member_list_text.push(this.members[i].abbr);
	     }
	     return song.getAbbr(n)+"("+member_list_text.join(",")+")";
	 };
     }

     // MC
     function MC(){
	 this.time = momokuno.conf.mc.time;

	 this.getTitle = function(n){
	     return "MC";
	 };

	 this.getAbbr = function(n){
	     return "MC";
	 };
     }

     // Member
     function Member(name, abbr){
	 this.name = name;
	 this.abbr = abbr;
     }

     // SetList
     function SetList(list){
	 // private
	 var time_str = function(sec){
	     var h = Math.floor(sec/3600),
		 m = Math.floor((sec-h*3600)/60),
		 s = Math.floor(sec-h*3600-m*60);
	     return (h > 0 ? h+"時間" : "") +  (m>0 ? m+"分" : "") + (s+"秒");
	 };
	 
	 this.list = list;
	 this.time = 0;
	 this.meetingtime = Math.floor(getRandomGaussian(momokuno.conf.meetingtime.mean,
							momokuno.conf.meetingtime.sd));
	 
	 this.time += this.meetingtime;
	 
	 for(var i=0; i<this.list.length; i++){
	     this.time += this.list[i].time;
	 }

	 this.getFullText = function(sep){
	     var num = 0;
	     var text_list = [];
	     text_list.push("曲決め:"+time_str(this.meetingtime));

	     for(var i=0; i<this.list.length; i++){
		 if(this.list[i] instanceof Song ||
		    this.list[i] instanceof Song5W1H){
		     num += 1;
		 }
		 text_list.push(this.list[i].getTitle(num));
	     }

	     var time_sum_str = time_str(this.time);
	     if(this.time > momokuno.conf.timelimit){
		 text_list.push(time_sum_str+"で負け");		 
	     } else {
		 text_list.push(time_sum_str+"で勝ち");
	     }

	     return text_list.join(sep);
	 };

	 this.getText = function(sep){
	     var num = 0;
	     var text_list = [];
	     text_list.push("曲決"+time_str(this.meetingtime));

	     for(var i=0; i<this.list.length; i++){
		 if(this.list[i] instanceof Song ||
		    this.list[i] instanceof Song5W1H) {
		     num += 1;
		 }
		 text_list.push(this.list[i].getAbbr(num));
	     }

	     var time_sum_str = time_str(this.time);
	     if(this.time > momokuno.conf.timelimit){
		 text_list.push(time_sum_str+"で負け");		 
	     } else {
		 text_list.push(time_sum_str+"で勝ち");
	     }

	     return text_list.join(sep);
	 };
     }


     // private functions
     var contains = function(target, list){
	 for(var i=0,l=list.length; i<l; i++){
	     if(list[i] === target){
		 return true;
	     }
	 }
	 return false;
     };

    
    var XORShift = {
	x : 123456789,
	y : 362436069,
	z : 521288629,
	w : 88675123,
	p : 10007,		// prime
	seed : function(seed){
	    this.w = seed;
	},
	random : function(){
	    var t = this.x^(this.x<<11);
	    this.x = this.y;
	    this.y = this.z;
	    this.z = this.w;
	    this.w = (this.w^(this.w>>19))^(t^(t>>8));

	return (this.w % this.p) / this.p;
	},
	reset : function(){
	    this.x = 123456789;
	    this.y = 362436069;
	    this.z = 521288629;
	    this.w = 88675123;
	}
    };


    var getRandomGaussian = function(mu, sigma){
	var x = XORShift.random(),
	    y = XORShift.random();
	var z1 = Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * y),
	    z2 = Math.sqrt(-2 * Math.log(x)) * Math.sin(2 * Math.PI * y);
	
	return z1 * sigma + mu;
    };

     var getRandomInt = function(max){
	 return Math.floor(XORShift.random()*(max));
     };
     
     var selectRamdomInt = function(max, nglist){
	 if(max<=nglist.length){
	     return null;
	 }

	 for(var i = getRandomInt(max); contains(i, nglist); i = getRandomInt(max)){
	     
	 }
	 return i;
     };
     
     var getRandomMembers = function(){
	 var candidates = momokuno.conf.members;
	 var n = Math.floor(XORShift.random()*(candidates.length-1))+1;
	 var member_list = [];
	 var selected_index_list = [];
	 for(var i=0; i<n; i++){
	     var index = selectRamdomInt(candidates.length, selected_index_list);
	     member_list.push(candidates[index]);
	     selected_index_list.push(index);
	 }
	 return member_list;
     };

    var selectRandomSong = function(size, index_list, ignore_solo_or_unit){
	var index = selectRamdomInt(size, index_list);
	while(true){
	    var s = momokuno.conf.songlist[index];
	    if(s.p > XORShift.random() && 
	       (!ignore_solo_or_unit || !s.solo_or_unit)){
		break;
	    }
	    index = selectRamdomInt(size, index_list);
	}
	return index;
    };
     
     momokuno.conf.songlist = [
	 new Song("あの空に向かって", "あの空", 285),
	 new Song("Dの純情", "D", 256),
	 new Song("CONTRADICTION", "コントラ", 255),
	 new Song("ももいろパンチ", "ももパン", 266),
	 new Song("Z伝説〜終わりなき革命〜", "Z伝説", 309),
	 new Song("ワニとシャンプー", "ワニシャン", 245),
	 new Song("ラフスタイル", "ラフスタ", 255),
	 new Song("行くぜ!怪盗少女", "怪盗", 228),
	 new Song("全力少女", "全力", 268),
	 new Song("キミノアト", "キミノアト", 294),
	 new Song("Sweet Dream", "Sweet Dream", 267),
	 new Song("天手力男", "天手力男", 290),
	 new Song("最強パレパレード", "パレパレ", 256),
	 new Song("Chai Maxx", "チャイマ", 276),
	 new Song("オレンジノート", "オレンジ", 289),
	 new Song("Hello..goodbye", "ハログバ", 229),
	 new Song("スターダストセレナーデ", "スタセレ", 272),
	 new Song("未来へススメ", "未来へ", 248),
	 new Song("ミライボウル", "ミラボ", 267),
	 new Song("コノウタ", "コノウタ", 265),
	 new Song("ツヨクツヨク", "ツヨク", 233),
	 new Song("走れ!", "走れ", 276),
	 new Song("words of mind -brandnew journey-", "ワーズ", 297),
	 new Song("ももクロのニッポン万歳", "万歳", 302),
	 new Song("気分はSuper Girl", "スパガ", 288),
	 new Song("サラバ、愛しき悲しみたちよ", "サラバ", 300),
	 new Song("ピンキージョーンズ", "PJ", 253),
	 new Song("Believe", "Believe", 236),
	 new Song("労働讃歌", "労働", 278),
	 new Song("みてみて☆こっちっち", "こっちっち", 235),
	 new Song("ベター is the Best", "ベター", 254),
	 new Song("サンタさん", "サンタ", 289),
	 new Song("BIONIC CHERRY", "BC", 248),
	 new Song("黒い週末", "黒い週末", 383),
	 new Song("ニッポン笑顔百景", "笑顔百景", 237),
	 new Song("Z女戦争", "Z女", 416),
	 new Song("空のカーテン", "カーテン", 365),
	 new Song("We are UFI!!!", "UFI", 303),
	 new Song("Wee-Tee-Wee-Tee", "WTWT", 265),
	 new Song("もリフだョ!全員集合", "もリフ", 250),
	 new Song("僕等のセンチュリー", "僕セン", 288),
	 new Song("LOST CHILD", "ロスチャ", 303),
	 new Song("白い風", "白い風", 255),
	 new Song("ココ☆ナツ", "ココナツ", 248),
	 new Song("猛烈宇宙交響曲・第七楽章「無限の愛」", "猛烈", 312),
	 new Song("きみゆき", "きみゆき", 317),
	 new Song("MILKY WAY", "MILKY", 238),
	 new Song("PUSH", "PUSH", 278),
	 new Song("キミとセカイ", "キミセカ", 244),
	 new Song("DNA狂詩曲", "DNA", 259),
	 new Song("Neo STARGATE", "ネオスタ", 353), // 前奏 145秒は除く
	 new Song("仮想ディストピア", "仮想", 249),
	 new Song("5 The POWER", "5TP", 259),
	 new Song("ゲッダーン!", "ゲッダーン", 214),
	 new Song("月と銀紙飛行船", "銀紙", 315),
	 new Song("BIRTH Ø BIRTH", "バース", 302),
	 new Song("上球物語 -Carpe diem-", "上球", 243),
	 new Song("上球Maxx", "上球Maxx", 243), // 暫定
	 new Song("宙飛ぶ! お座敷列車", "お座敷", 268),
	 new Song("灰とダイヤモンド", "灰ダイ", 411),
	 new Song("だいすき!!", "だいすき", 228),
	 new Song("冷凍みかん", "冷凍", 227, 0.5),
	 new Song("ハズムリズム", "ハズム", 267, 0.5),
	 new Song("大声ダイヤモンド", "大声", 248, 0.1),
	 new Song("言い訳May be", "言い訳", 249, 0.1),
	 new Song("Dream Wave", "DW", 192),
	 new Song("Jasper", "Jasper", 225, 0.5),
	 new Song("fall into me", "fall", 189, 1.0, true),
	 new Song("太陽とえくぼ", "太陽", 258, 1.0, true),
	 new Song("渚のラララ", "渚", 295, 1.0, true),
	 new Song("恋は暴れ鬼太鼓", "鬼太鼓", 207, 1.0, true),
	 new Song("津軽半島竜飛崎", "竜飛崎", 257, 1.0, true),
	 new Song("…愛ですか?", "愛ですか", 273, 1.0, true),
	 new Song("涙目のアリス", "涙目", 286, 1.0, true),
	 new Song("だって あーりんなんだもん☆", "だてあり", 257, 1.0, true),
	 new Song("あーりんは反抗期", "反抗期", 287, 1.0, true),
	 new Song("ありがとうのプレゼント", "ありプレ", 289, 1.0, true),
	 new Song("教育", "教育", 197, 1.0, true),
	 new Song("シングルベッドはせまいのです", "シングル", 248, 1.0, true),
	 new Song("事務所にもっと推され隊", "推され隊", 246, 1.0, true),
	 new Song("恋のダイヤル6700", "ダイヤル", 174, 0.1, true), // Zepp Sapporo から算出 (http://www.youtube.com/watch?v=p0ab_FqWxGo)
	 new Song("恋はあせらず", "あせらず", 177, 0.1, true), // 横アリから算出
	 new Song("情熱", "情熱", 156, 0.1),
	 new Song("SWEAT&TEARS", "S&T", 339, 0.1), // フォーク村から算出
	 new Song("春になったら", "春に", 297, 0.25),
	 new Song("むかし子供達は", "子供達", 313, 0.1)
     ];

     momokuno.conf.members = [
	 new Member("百田夏菜子", "百"),
	 new Member("玉井詩織", "玉"),
	 new Member("有安杏果", "有"),
	 new Member("佐々木彩夏", "佐"),
	 new Member("高城れに", "高")
     ];
     
     momokuno.generate = function(seed){
	 var result = [];
	 var size = this.conf.songlist.length;
	 var index_list = [];
	 var random_seed = seed === undefined ? (new Date()).getTime() : seed;

	 XORShift.reset();
	 XORShift.seed(random_seed);

	 for(var i=0; i<this.conf.typelist.length; i++){
	     var type = this.conf.typelist[i];
	     var index = -1;

	     switch(type){
	     case this.types.SONG:
		 // ソロもしくはユニット曲は選択しない
		 index = selectRandomSong(size, index_list, true);
		 index_list.push(index);
		 result.push(this.conf.songlist[index]);
		 break;
		 
	     case this.types.MC:
		 result.push(new MC());
		 break;
		 
	     case this.types.SW1H:
		 // ソロもしくはユニット曲を選択してもよい
		 index = selectRandomSong(size, index_list, false);
		 index_list.push(index);
		 result.push(new Song5W1H(this.conf.songlist[index],getRandomMembers()));
		 break;
	     }
	     
	 }
	 
	 return new SetList(result);
     };
 })(MOMOKUNO);

