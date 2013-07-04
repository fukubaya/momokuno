======================================================================
momokuno
======================================================================
Created by FUKUBAYASHI Yuichiro on 2013/07/05

About
======================================================================
ももクノのセットリストを生成する


How to use
======================================================================
momokuno.jsを読み込み，MOMOKUNO.generate(seed)を呼び出すだけ．
seedは適当な整数．省略すると(new Date()).getTime()が指定される．

::

    > var setlist = MOMOKUNO.generate(8888);
    undefined
    > setlist.time;
    3538
    > setlist.getFullText(", ");
    "曲決め:10分51秒, M1:気分はSuper Girl, M2:みてみて☆こっちっち, M3:We are UFI!!!, MC, M4:Z伝説〜終わりなき革命〜, M5:CONTRADICTION, M6:ベター is the Best, MC, M7:…愛ですか?(有安杏果), M8:教育(佐々木彩夏,百田夏菜子,玉井詩織,高城れに), M9:Sweet Dream, M10:ももいろパンチ, 58分58秒で勝ち"
    > setlist.getText(", ");
    "曲決10分51秒, 1スパガ, 2こっちっち, 3UFI, MC, 4Z伝説, 5コントラ, 6ベター, MC, 7愛ですか(有), 8教育(佐,百,玉,高), 9Sweet Dream, 10ももパン, 58分58秒で勝ち"

LICENSE
======================================================================
The MIT License

Copyright (c) 2013 FUKUBAYASHI Yuichiro

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

以下に定める条件に従い、本ソフトウェアおよび関連文書のファイル（以下「ソフトウェア」）の複製を取得するすべての人に対し、ソフトウェアを無制限に扱うことを無償で許可します。これには、ソフトウェアの複製を使用、複写、変更、結合、掲載、頒布、サブライセンス、および/または販売する権利、およびソフトウェアを提供する相手に同じことを許可する権利も無制限に含まれます。

上記の著作権表示および本許諾表示を、ソフトウェアのすべての複製または重要な部分に記載するものとします。

ソフトウェアは「現状のまま」で、明示であるか暗黙であるかを問わず、何らの保証もなく提供されます。ここでいう保証とは、商品性、特定の目的への適合性、および権利非侵害についての保証も含みますが、それに限定されるものではありません。 作者または著作権者は、契約行為、不法行為、またはそれ以外であろうと、ソフトウェアに起因または関連し、あるいはソフトウェアの使用またはその他の扱いによって生じる一切の請求、損害、その他の義務について何らの責任も負わないものとします。
