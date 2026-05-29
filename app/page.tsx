"use client";

import { useState, useEffect, useRef } from "react";

const CATEGORY_COLORS = {
  alkali: { bg: "#ff6b6b22", border: "#ff6b6b", label: "アルカリ金属" },
  alkaline: { bg: "#ffa94d22", border: "#ffa94d", label: "アルカリ土類金属" },
  lanthanoid: { bg: "#a9e34b22", border: "#a9e34b", label: "ランタノイド" },
  actinoid: { bg: "#74c0fc22", border: "#74c0fc", label: "アクチノイド" },
  transition: { bg: "#da77f222", border: "#da77f2", label: "遷移金属" },
  postTransition: { bg: "#63e6be22", border: "#63e6be", label: "典型金属" },
  metalloid: { bg: "#ffd43b22", border: "#ffd43b", label: "半金属" },
  nonmetal: { bg: "#ff8787aa", border: "#ff8787", label: "非金属" },
  halogen: { bg: "#f783ac22", border: "#f783ac", label: "ハロゲン" },
  nobleGas: { bg: "#4dabf722", border: "#4dabf7", label: "希ガス" },
  unknown: { bg: "#adb5bd22", border: "#adb5bd", label: "その他" },
};

const getCategory = (no) => {
  if ([1].includes(no)) return "nonmetal";
  if ([2, 10, 18, 36, 54, 86, 118].includes(no)) return "nobleGas";
  if ([3, 11, 19, 37, 55, 87].includes(no)) return "alkali";
  if ([4, 12, 20, 38, 56, 88].includes(no)) return "alkaline";
  if (no >= 57 && no <= 71) return "lanthanoid";
  if (no >= 89 && no <= 103) return "actinoid";
  if ((no >= 21 && no <= 30) || (no >= 39 && no <= 48) || (no >= 72 && no <= 80) || (no >= 104 && no <= 112)) return "transition";
  if ([13, 31, 49, 50, 81, 82, 83, 84, 113, 114, 115, 116].includes(no)) return "postTransition";
  if ([5, 14, 32, 33, 51, 52, 85].includes(no)) return "metalloid";
  if ([6, 7, 8, 15, 16, 34].includes(no)) return "nonmetal";
  if ([9, 17, 35, 53, 85, 117].includes(no)) return "halogen";
  return "unknown";
};

const questions = [
  { no: 1, symbol: "H", name: "水素", info: "宇宙で最も多く存在する最も軽い元素。クリーンな次世代エネルギーとして注目されています。主要な物質の例：水、アンモニア、塩酸、水素燃料、ロケット燃料", electrons: [1] },
  { no: 2, symbol: "He", name: "ヘリウム", info: "最も軽い希ガス。非常に安定しており、絶対に燃えないのが特徴です。主要な物質の例：観測用風船、吸入用ボイスガス、MRI冷却用液体ヘリウム、超伝導マグネット、溶接用保護ガス", electrons: [2] },
  { no: 3, symbol: "Li", name: "リチウム", info: "最も軽い金属。水に浮くほど軽く、エネルギーを高密度に蓄えられます。主要な物質の例：リチウムイオン電池、心臓ペースメーカー、スマートフォンバッテリー、モバイルバッテリー、電気自動車用電池", electrons: [2, 1] },
  { no: 4, symbol: "Be", name: "ベリリウム", info: "極めて軽く頑丈な金属。毒性がありますが、宇宙や航空の先端素材に不可欠です。主要な物質の例：宇宙望遠鏡の主鏡、航空機のブレーキ材、エックス線管の放射窓、高級スピーカーの振動板、銅ベリリウム合金", electrons: [2, 2] },
  { no: 5, symbol: "B", name: "ホウ素", info: "ガラスの強化や殺虫、強力な磁石の補助など、地味ながら多彩に活躍する元素。主要な物質の例：ホウ酸水（目薬）、ネオジム磁石、耐熱ガラス（パイレックス）、殺虫剤（ホウ酸団子）、植物用肥料", electrons: [2, 3] },
  { no: 6, symbol: "C", name: "炭素", info: "地球のあらゆる有機物の基本となる元素。結びつき方で強さも価値も激変します。主要な物質の例：ダイヤモンド、鉛筆の芯（黒鉛）、炭・木炭、炭素繊維（カーボン）、二酸化炭素", electrons: [2, 4] },
  { no: 7, symbol: "N", name: "窒素", info: "大気の約78%を占める気体。食べ物の酸化を防いだり、超低温での冷却に使われます。主要な物質の例：液化窒素（冷却剤）、アンモニア、お菓子の袋の充填ガス、窒素肥料、ダイナマイト（硝酸系）", electrons: [2, 5] },
  { no: 8, symbol: "O", name: "酸素", info: "生物の呼吸に必須の気体。地球上で最も多くの化合物を作っている、反応性の高い元素です。主要な物質の例：医療用酸素ボンベ、水、オゾン、過酸化水素水（オキシドール）、鉄サビ（酸化鉄）", electrons: [2, 6] },
  { no: 9, symbol: "F", name: "フッ素", info: "最強の反応性を持つ毒ガスですが、化合物にすると非常に安定して便利になります。主要な物質の例：歯磨き粉（虫歯予防）、テフロンフライパン、エアコンのフロンガス、フッ素樹脂、半導体エッチングガス", electrons: [2, 7] },
  { no: 10, symbol: "Ne", name: "ネオン", info: "光を放つことで有名な希ガス。電気を流すと鮮やかな赤橙色に光り輝きます。主要な物質の例：ネオンサイン、高圧表示灯、半導体露光用エキシマレーザー、低温冷却剤、放電管", electrons: [2, 8] },
  { no: 11, symbol: "Na", name: "ナトリウム", info: "水と激しく反応して爆発するアルカリ金属。塩の主成分として生命に不可欠です。主要な物質の例：食塩（塩化ナトリウム）、重曹、高圧ナトリウムランプ（トンネルの黄色い灯り）、水酸化ナトリウム（苛性ソーダ）、液体ナトリウム冷却材", electrons: [2, 8, 1] },
  { no: 12, symbol: "Mg", name: "マグネシウム", info: "実用金属の中で最も軽く、非常に眩しく激しく燃える性質を持っています。主要な物質の例：スマートフォンの筐体、花火の閃光材、にがり（塩化マグネシウム）、自動車の軽量ホイール、使い捨てカイロの反応助剤", electrons: [2, 8, 2] },
  { no: 13, symbol: "Al", name: "アルミニウム", info: "一円玉やアルミホイルでおなじみ。軽くて加工しやすく、サビにも強い優秀な金属です。主要な物質の例：一円硬貨、アルミホイル、飲料用アルミ缶、サッシ（窓枠）、飛行機の機体（ジュラルミン）", electrons: [2, 8, 3] },
  { no: 14, symbol: "Si", name: "ケイ素", info: "半導体の主役。地球の地殻に酸素に次いで多く存在し、ガラスの原料にもなります。主要な物質の例：CPU（半導体チップ）、シリコンゴム、ガラス、太陽光パネル、石英（水晶）", electrons: [2, 8, 4] },
  { no: 15, symbol: "P", name: "リン", info: "マッチの頭薬や生命の遺伝子（DNA）の骨格をなす、生物に絶対に欠かせない元素です。主要な物質の例：マッチの側面の擦り付け面、赤リン、リン酸肥料、DNA・RNA、合成洗剤の添加剤", electrons: [2, 8, 5] },
  { no: 16, symbol: "S", name: "硫黄", info: "温泉地などの臭いの元。黄色い非金属で、ゴムの硬化や火薬の原料として文明を支えます。主要な物質の例：温泉の湯の華、火薬、硫酸、自動車タイヤ（ゴムの架橋剤）、マッチの頭薬", electrons: [2, 8, 6] },
  { no: 17, symbol: "Cl", name: "塩素", info: "強力な殺菌・漂白作用を持つ黄緑色のガス。水道水の消毒やプールの衛生維持に使われます。主要な物質の例：水道水の消毒剤、衣類用漂白剤、塩酸、ポリ塩化ビニル（塩ビ管）、胃酸", electrons: [2, 8, 7] },
  { no: 18, symbol: "Ar", name: "アルゴン", info: "大気中に3番目に多く含まれる希ガス。他の物質と絶対に反応しない性質を利用します。主要な物質の例：白熱電球の封入ガス、溶接用シールドガス、多層ガラスの断熱材、蛍光灯の内部ガス、半導体製造装置の環境ガス", electrons: [2, 8, 8] },
  { no: 19, symbol: "K", name: "カリウム", info: "ナトリウムに似た激しい反応性を持つ金属。植物の生育に必須の「肥料の三要素」の一つです。主要な物質の例：カリ肥料、塩化カリウム、バナナ（豊富に含まれる食品）、水酸化カリウム、石鹸の原料", electrons: [2, 8, 8, 1] },
  { no: 20, symbol: "Ca", name: "カルシウム", info: "骨や歯の主成分として知られる金属。チョークやセメントなど建設資材の主役でもあります。主要な物質の例：牛乳・骨、チョーク、セメント、石膏ボード、乾燥剤（塩化カルシウム）", electrons: [2, 8, 8, 2] },
  { no: 21, symbol: "Sc", name: "スカンジウム", info: "レアメタルの一種。アルミに少量混ぜるだけで強度が跳ね上がるため、高級スポーツ用品等に使われます。主要な物質の例：高級自転車フレーム、メタルハライドランプ、野球のアルミバット、航空機の溶接構造材、燃料電池の電解質", electrons: [2, 8, 9, 2] },
  { no: 22, symbol: "Ti", name: "チタン", info: "軽くて強く、絶対にサビない上に金属アレルギーも起こさない医療・航空宇宙のスーパー金属。主要な物質の例：メガネフレーム、人工関節、航空機のエンジン部品、ゴルフクラブのヘッド、白い塗料（酸化チタン）", electrons: [2, 8, 10, 2] },
  { no: 23, symbol: "V", name: "バナジウム", info: "構造用鋼鉄を著しく強化するレアメタル。バナジウム天然水でもおなじみの成分です。主要な物質の例：バナジウム天然水、自動車のレンチ・工具、スパナ、ビルの補強鉄筋、化学工業の触媒", electrons: [2, 8, 11, 2] },
  { no: 24, symbol: "Cr", name: "クロム", info: "非常に硬く、美しい銀白色の光沢を持つため、蛇口などのめっきやステンレス鋼に使われます。主要な物質の例：水道の蛇口めっき、ステンレスのフライパン、工具のクロムめっき、緑色の絵の具、革製品のなめし剤", electrons: [2, 8, 13, 1] },
  { no: 25, symbol: "Mn", name: "マンガン", info: "鉄の硬度を高める必須の添加元素。乾電池の材料としても古くから非常に身近な存在です。主要な物質の例：マンガン乾電池、レール用高マンガン鋼、ステンレス鋼の添加剤、植物用微量肥料、過マンガン酸カリウム（消毒剤）", electrons: [2, 8, 13, 2] },
  { no: 26, symbol: "Fe", name: "鉄", info: "人類の文明を支える最も一般的な金属。地球のコアの主成分であり、血液中で酸素を運ぶ役割も担います。主要な物質の例：ビル建築の鉄骨、自動車のボディ、フライパン（南部鉄器）、血液のヘモグロビン、鉄釘", electrons: [2, 8, 14, 2] },
  { no: 27, symbol: "Co", name: "コバルト", info: "美しい青色の顔料や、強力な磁石、EV用リチウム電池の材料に使われる超重要レアメタル。主要な物質の例：コバルトブルーの絵の具、リチウムイオン電池の正極材、サマリウムコバルト磁石、ビタミンB12、ジェットエンジンの超合金", electrons: [2, 8, 15, 2] },
  { no: 28, symbol: "Ni", name: "ニッケル", info: "50円・100円硬貨の材料。サビにくく、ステンレス鋼の合金成分や各種電池の材料として重宝されます。主要な物質の例：50円・100円硬貨、ステンレス水筒、ニッケル水素電池、ギターの弦、プラモデルのニッケルめっき", electrons: [2, 8, 16, 2] },
  { no: 29, symbol: "Cu", name: "銅", info: "電気を非常に通しやすいため、電線や10円玉に使用。人類が最も古くから使っている金属の一つです。主要な物質の例：10円硬貨、電気コードの導線、エアコンの配管、ブロンズ像（青銅）、調理用銅鍋", electrons: [2, 8, 18, 1] },
  { no: 30, symbol: "Zn", name: "亜鉛", info: "トタン（鉄の防サビめっき）や5円玉の材料。人間の健康維持・味覚を保つ必須ミネラルです。主要な物質の例：5円硬貨（真鍮）、トタン屋根、亜鉛サプリメント、乾電池の負極、防サビ亜鉛めっき", electrons: [2, 8, 18, 2] },
  { no: 31, symbol: "Ga", name: "ガリウム", info: "融点が約30℃と非常に低く、手のひらの上でドロドロに溶ける不思議な金属。青色LEDの基板に使用されます。主要な物質の例：青色LED、非接触体温計のセンサー、パワー半導体、光通信用レーザー素子", electrons: [2, 8, 18, 3] },
  { no: 32, symbol: "Ge", name: "ゲルマニウム", info: "初期のトランジスタに使われた半導体。赤外線を透過するため、ナイトビジョンカメラのレンズに必須です。主要な物質の例：赤外線カメラのレンズ、光ファイバーのコア添加剤、通信用ダイオード、太陽電池の基板", electrons: [2, 8, 18, 4] },
  { no: 33, symbol: "As", name: "ヒ素", info: "毒殺の歴史に登場する有名な猛毒元素。しかし現代では、超高速半導体の材料として非常に重要です。主要な物質の例：高周波半導体（ヒ化ガリウム）、レーザーダイオード、木材防腐剤、一部の抗がん剤、LED素子", electrons: [2, 8, 18, 5] },
  { no: 34, symbol: "Se", name: "セレン", info: "光が当たると電気が流れる性質を持ち、コピー機の感光体に使われました。毒性がありますが必須微量元素です。主要な物質の例：太陽電池、赤色ガラスの着色剤、コピー機の感光ドラム、整流器、セレン酵母サプリメント", electrons: [2, 8, 18, 6] },
  { no: 35, symbol: "Br", name: "臭素", info: "常温で液体である唯一の非金属元素。激しい悪臭を放ち、写真の感光剤や難燃剤に使われます。主要な物質の例：プラスチックの難燃剤、写真フィルムの臭化銀、医薬品（鎮静剤）、プール水の消毒剤、染料", electrons: [2, 8, 18, 7] },
  { no: 36, symbol: "Kr", name: "クリプトン", info: "白熱電球や高級カメラのフラッシュガス、窓ガラスの断熱材として空気層に封入される高価な希ガス。主要な物質の例：高級カメラのフラッシュ、電球の長寿命化ガス、二重サッシの断熱ガス、准分子レーザー、滑走路の誘導灯", electrons: [2, 8, 18, 8] },
  { no: 37, symbol: "Rb", name: "ルビジウム", info: "非常に反応性が高いアルカリ金属。極めて正確な「原子時計」の基準として通信インフラを支えています。主要な物質の例：GPS衛星のルビジウム原子時計、光電管、ガラスの着色剤、花火の紫色の発色、研究用量子冷却ガス", electrons: [2, 8, 18, 8, 1] },
  { no: 38, symbol: "Sr", name: "ストロンチウム", info: "花火の「深紅」を出す炎色反応で有名。夜光塗料の発光を助ける素材としても使われています。主要な物質の例：花火の赤い発色、夜光塗料（蓄光顔料）、フェライト磁石の原料、骨粗鬆症の治療薬（海外）、電子管のゲッター", electrons: [2, 8, 18, 8, 2] },
  { no: 39, symbol: "Y", name: "イットリウム", info: "超伝導材料や、かつてのブラウン管テレビの赤色蛍光体、医療用レーザー技術に不可欠なレアメタルです。主要な物質の例：YAGレーザーメス、高温超伝導体、強化セラミックス、ブラウン管の赤色蛍光体、LEDの黄色蛍光体", electrons: [2, 8, 18, 9, 2] },
  { no: 40, symbol: "Zr", name: "ジルコニウム", info: "中性子を吸収しにくいため原子力発電に採用。人工ダイヤモンド（ジルコニア）の原料としても有名。主要な物質の例：人工ダイヤモンド（キュービックジルコニア）、原発の燃料棒被覆管、セラミック包丁、耐火レンガ、入れ歯のフレーム", electrons: [2, 8, 18, 10, 2] },
  { no: 41, symbol: "Nb", name: "ニオブ", info: "リニアやMRIに使われる「超伝導マグネット」の合金材料として極めて重要なレアメタル。主要な物質の例：リニアモーターカー超伝導磁石、MRI装置のコイル、高強度ロケットノズル、ジェットエンジン合金、コンデンサ用材料", electrons: [2, 8, 18, 12, 1] },
  { no: 42, symbol: "Mo", name: "モリブデン", info: "高熱に耐える合金を作る材料。エンジンオイルの摩擦低減剤（潤滑油）にも使用され、工業に必須です。主要な物質の例：自動車のエンジンオイル添加剤、ドリル等の工具鋼、ビルの高強度ボルト、ステンレスのサビ防止添加、液晶パネルの配線", electrons: [2, 8, 18, 13, 1] },
  { no: 43, symbol: "Tc", name: "テクネチウム", info: "人類が「人工的」に作り出した最初の元素。すべての同位体が放射性で、医療がんの診断用マーカーに使われます。主要な物質の例：骨シンチグラフィ（がん診断薬）、脳血流診断薬、放射性追跡子、核医学検査薬、研究用合成標的", electrons: [2, 8, 18, 13, 2] },
  { no: 44, symbol: "Ru", name: "ルテニウム", info: "ハードディスク（HDD）の記録容量を飛躍的に高めるための極薄レイヤーに採用されています。主要な物質の例：パソコンのハードディスク記録面、万年筆のペン先合金、チップ抵抗器、太陽光水素製造触媒、ジュエリー用プラチナ合金硬化剤", electrons: [2, 8, 18, 15, 1] },
  { no: 45, symbol: "Rh", name: "ロジウム", info: "非常にサビにくく、貴金属の中で最高クラスの価格を誇る。自動車の排気ガスをきれいにする触媒の王様です。主要な物質の例：自動車の排ガス浄化触媒、ホワイトゴールドの仕上げめっき、高級反射鏡、化学工業用るつぼ、熱電対線", electrons: [2, 8, 18, 16, 1] },
  { no: 46, symbol: "Pd", name: "パラジウム", info: "自分の体積の900倍もの水素ガスを吸い込む性質がある金属。銀歯の合金や自動車触媒に使われます。主要な物質の例：歯科治療の銀歯（金銀パラジウム合金）、自動車の排ガス浄化触媒、結婚指輪（プラチナ合金）、水素精製フィルター、有機化学のクロスカップリング触媒", electrons: [2, 8, 18, 18] },
  { no: 47, symbol: "Ag", name: "銀", info: "金属の中で最も電気と熱を通し、光を反射する性質を持ちます。鏡や太陽光パネルに必須。主要な物質の例：鏡の反射膜、太陽光パネルの配線、銀食器・ジュエリー、写真フィルムの感光材、殺菌用銀イオン", electrons: [2, 8, 18, 18, 1] },
  { no: 48, symbol: "Cd", name: "カドミウム", info: "イタイイタイ病の原因となった有害な重金属。かつては黄色い絵の具やニカド電池に多く使われていました。主要な物質の例：カドミウムイエロー（黄色絵の具）、旧式のニカド電池、航空機ボルトの防食めっき、原子力発電の制御棒、半導体量子ドット", electrons: [2, 8, 18, 18, 2] },
  { no: 49, symbol: "In", name: "インジウム", info: "スマホやテレビの液晶画面に不可欠な「透明な電極（ITO）」を作るために欠かせない超重要レアメタル。主要な物質の例：スマートフォンのタッチパネル、液晶テレビの画面、低温ハンダ、次世代化合物太陽電池、光通信レーザーダイオード", electrons: [2, 8, 18, 18, 3] },
  { no: 50, symbol: "Sn", name: "スズ", info: "青銅の時代から使われる金属。鉄缶にスズをめっきしたものが「ブリキ」で、基板のハンダ付けにも使われます。主要な物質の例：ハンダ（電子基板の接着）、お菓子のブリキ缶、ブロンズ製（青銅）の鐘、ピューター（スズ食器）、ガラス製造用フロートバス", electrons: [2, 8, 18, 18, 4] },
  { no: 51, symbol: "Sb", name: "アンチモン", info: "レアメタルの一種。プラスチックが燃えるのを防ぐ「難燃剤」や、鉛バッテリーの強化剤として使われます。主要な物質の例：プラスチックの難燃助剤、車の鉛蓄電池極板、半導体ドーパント、弾丸の鉛硬化剤、赤外線検出器", electrons: [2, 8, 18, 18, 5] },
  { no: 52, symbol: "Te", name: "テルル", info: "ゴムの加硫や、DVD-RAMの記録層、次世代の太陽光パネルに使用される元素。主要な物質の例：DVD-RAMの記録層、熱電発電素子（冷却シート）、高性能化合物太陽電池、鉄鋼の切削性向上剤、有機合成触媒", electrons: [2, 8, 18, 18, 6] },
  { no: 53, symbol: "I", name: "ヨウ素", info: "うがい薬の独特な消毒臭の主成分。日本は世界第2位の産出拠点で、レントゲン造影剤にも使われます。主要な物質の例：イソジン（うがい薬）、偏光板（スマホ画面の必須部品）、レントゲン検査の造影剤、ヨウ化銀（人工降雨）、飼料添加物", electrons: [2, 8, 18, 18, 7] },
  { no: 54, symbol: "Xe", name: "キセノン", info: "車の強力なヘッドライトや、宇宙の探査機ハヤブサの「イオンエンジン」の推進剤として有名な高価な希ガス。主要な物質の例：探査機はやぶさのイオンエンジン燃料、車のキセノンヘッドライト、高精度CTスキャナー、日焼け試験用ランプ、全身麻酔ガス", electrons: [2, 8, 18, 18, 8] },
  { no: 55, symbol: "Cs", name: "セシウム", info: "30℃弱で溶けるアルカリ金属。「1秒」の長さを世界共通で決定している最も正確な原子時計に使われています。主要な物質の例：国際基準のセシウム原子時計、石油掘削用泥水、光電管、ガン治療用放射線源、ナイトビジョン装置", electrons: [2, 8, 18, 18, 8, 1] },
  { no: 56, symbol: "Ba", name: "バリウム", info: "健康診断で胃のレントゲンを撮る時に飲む白い液体の主成分。花火の「緑色」もこれです。主要な物質の例：胃のレントゲン造影剤（硫酸バリウム）、花火の緑色の発色、光沢紙のコーティング、フェライト磁石、ガラスの屈折率向上剤", electrons: [2, 8, 18, 18, 8, 2] },
  { no: 57, symbol: "La", name: "ランタン", info: "ランタノイドの代表。ハイブリッド車のニッケル水素電池や、高級なカメラレンズに使用。主要な物質の例：高級一眼レフのレンズ、プリウスなどのニッケル水素電池、ライターの発火石、映画プロジェクターのアーク灯、流動接触分解触媒", electrons: [2, 8, 18, 18, 9, 2] },
  { no: 58, symbol: "Ce", name: "セリウム", info: "ガラスの研磨剤として大量に消費されるほか、ディーゼル車の排気ガス浄化、ライターの発火石に使われます。主要な物質の例：ガラス液晶画面の研磨剤、自動車の排ガス浄化触媒、ライターの石、自己掃除型オーブンの内壁、インスタントカメラのフラッシュ成分", electrons: [2, 8, 18, 19, 9, 2] },
  { no: 59, symbol: "Pr", name: "プラセオジム", info: "非常に強力なネオジム磁石の耐熱性を向上させる添加剤や、特殊な黄色いガラスフィルターに使用。主要な物質の例：高耐熱ネオジム磁石の添加剤、プラセオジムイエロー（セラミック黄色顔料）、溶接工用保護ゴーグル、航空機エンジン用マグネシウム合金、光ファイバー増幅器", electrons: [2, 8, 18, 21, 8, 2] },
  { no: 60, symbol: "Nd", name: "ネオジム", info: "最強の永久磁石「ネオジム磁石」の主役。EVのモーターやハードディスク、風力発電機に絶対不可欠な超重要元素。主要な物質の例：ネオジム磁石（100均やモーター）、電気自動車（EV）用駆動モーター、ハードディスクのヘッド駆動部、レーザー溶接機、高級ガラスの紫着色剤", electrons: [2, 8, 18, 22, 8, 2] },
  { no: 61, symbol: "Pm", name: "プロメチウム", info: "天然にはほぼ存在しない人工の放射性元素。かつて夜光時計の文字盤の蛍光塗料として微量に使われました。主要な物質の例：昔の夜光時計の針（発光塗料）、宇宙探査機の原子力電池（試作）、厚さ測定用放射線計、誘導ミサイルの計器、研究用放射線源", electrons: [2, 8, 18, 23, 8, 2] },
  { no: 62, symbol: "Sm", name: "サマリウム", info: "高温環境でも磁力が落ちにくい磁石の材料。オーディオの高級ヘッドホンなどに使用。主要な物質の例：サマリウムコバルト磁石（高温用モーター）、高級ヘッドホンのスピーカー、がんの骨転移の痛み緩和薬、光磁気ディスク、化学合成の還元剤", electrons: [2, 8, 18, 24, 8, 2] },
  { no: 63, symbol: "Eu", name: "ユウロピウム", info: "非常に優れた赤色・青色の発光特性を持つため、カラーディスプレイや偽札防止の蛍光インクに採用。主要な物質の例：テレビの赤色蛍光体、偽札防止用インク、LED照明の演色向上剤、蛍光灯の白発色素材、原子力発電の制御棒", electrons: [2, 8, 18, 25, 8, 2] },
  { no: 64, symbol: "Gd", name: "ガドリニウム", info: "中性子を吸収する力がトップクラスに高い。病院の「MRI検査の造影剤」や原子力発電の制御材に使われます。主要な物質の例：MRI検査の磁気造影剤、原発の制御棒材料、磁気冷凍機（次世代エコ冷蔵庫）、光磁気ディスク、高級レンズガラス", electrons: [2, 8, 18, 25, 9, 2] },
  { no: 65, symbol: "Tb", name: "テルビウム", info: "固体に磁界をかけると伸び縮みする不思議な性質（磁歪）を持ち、超音波スピーカーや高性能センサーに応用。主要な物質の例：超音波振動スピーカー、液晶画面の緑色蛍光体、ソナー（潜水艦の音波探知）、磁歪アクチュエータ、磁気光ディスク", electrons: [2, 8, 18, 27, 8, 2] },
  { no: 66, symbol: "Dy", name: "ジスプロシウム", info: "ネオジム磁石が熱で壊れるのを防ぐための極めて重要なレアメタル。ハイブリッドカーのモーターに必須。主要な物質の例：ハイブリッド車の駆動モーター用ネオジム磁石、磁気ひずみ合金、光ディスク記録層、高圧水銀ランプの添加剤、原子炉の制御材", electrons: [2, 8, 18, 28, 8, 2] },
  { no: 67, symbol: "Ho", name: "ホルミウム", info: "すべての元素の中で最も高い磁気的強さを持つ。医療用レーザーメスの光源に使われます。主要な物質の例：ホルミウムレーザー（結石手術用メス）、最強磁界発生用ポールピース、光ファイバーアンプ、核磁気共鳴装置の校正、黄色・ピンクのガラス着色", electrons: [2, 8, 18, 29, 8, 2] },
  { no: 68, symbol: "Er", name: "エルビウム", info: "光ファイバー通信の信号が弱まるのを防ぐ「光アンプ」の中核を担い、世界中のネット網を支える功労者。主要な物質の例：海底光ファイバーの信号増幅器（光アンプ）、歯科治療用レーザー、ピンク色の光彩ガラス、サングラスの紫外線カットレンズ、写真のフィルター", electrons: [2, 8, 18, 30, 8, 2] },
  { no: 69, symbol: "Tm", name: "ツリウム", info: "ランタノイドの中で最も希少で高価。携帯型のポータブルX線照射装置の光源など、特殊な医療分野に利用。主要な物質の例：携帯型ポータブルX線撮影機、医療用ホログラフィックレーザー、ユーロ紙幣の偽造防止蛍光体、アーク灯の輝度向上剤、研究用超低温磁気温度計", electrons: [2, 8, 18, 31, 8, 2] },
  { no: 70, symbol: "Yb", name: "イッテルビウム", info: "光格子時計と呼ばれる次世代の世界最高精度時計のレーザー冷却素材や、特殊な高強度レーザー加工機に使用。主要な物質の例：最高精度「光格子時計」の原子トラップ、高出力ディスクレーザー加工機、応力センサー（地震計測）、特殊ステンレス鋼の添加剤、ポータブルX線源", electrons: [2, 8, 18, 32, 8, 2] },
  { no: 71, symbol: "Lu", name: "ルテチウム", info: "ランタノイドの終着点。非常に硬く高密度なため、PET（がん検査装置）の高性能な検出器用結晶に使われます。主要な物質の例：PET（がん検診装置）のシンチレータ結晶、次世代高屈折率レンズ、半導体リソグラフィ液体、放射線がん治療（試験中）、隕石の年代測定触媒", electrons: [2, 8, 18, 32, 9, 2] },
  { no: 72, symbol: "Hf", name: "ハフニウム", info: "最新の超微細CPUのゲート絶縁膜に採用され、スマホやPCの高速・省電力を支える立役者。主要な物質の例：インテル・AMD等のCPU絶縁膜、原子力潜水艦の制御棒、プラズマ切断機の先端ノズル、ジェットエンジンの耐熱超合金、ガス加熱器のフィラメント", electrons: [2, 8, 18, 32, 10, 2] },
  { no: 73, symbol: "Ta", name: "タンタル", info: "スマホやゲーム機の基板にギッシリ並ぶコンデンサの材料。極小で大容量の電気を蓄える超重要素材。主要な物質の例：スマートフォンのタンタルコンデンサ、ゲーム機基板、化学工場の耐酸性バルブ、カメラの超高屈折率レンズ、人工骨の固定スクリュー", electrons: [2, 8, 18, 32, 11, 2] },
  { no: 74, symbol: "W", name: "タングステン", info: "金属の中で最高の融点を持ち、ダイヤモンドに匹敵する硬さ。電球や超硬工具に使われます。主要な物質の例：白熱電球のフィラメント、金属切削用超硬ドリル、高級万年筆のボール芯、ダーツの矢（タングステンバレル）、対戦車ミサイルの徹甲弾頭", electrons: [2, 8, 18, 32, 12, 2] },
  { no: 75, symbol: "Re", name: "レニウム", info: "非常にレアで高価。ジェットエンジンのタービンブレードにニッケルと合金化して使われ、超高温に耐える役割を担う。主要な物質の例：ジェットエンジンのタービン翼、航空機のロケットスラスター、質量分析計のフィラメント、ガソリン精製用プラチナレニウム触媒、閃光電球", electrons: [2, 8, 18, 32, 13, 2] },
  { no: 76, symbol: "Os", name: "オスミウム", info: "全元素の中で最も密度が高い（超重い金属）。非常に硬いため、高級万年筆のペン先に合金として使用。主要な物質の例：高級万年筆のペン先（イリドスミン合金）、レコードの針、電気接点、顕微鏡検査用の電子染色剤（四酸化オスミウム）、有機化学の酸化触媒", electrons: [2, 8, 18, 32, 14, 2] },
  { no: 77, symbol: "Ir", name: "イリジウム", info: "恐竜絶滅の地層から大量に見つかる金属。耐熱・耐食性が凄まじく、高級車のプラグやキログラム原器に使用。主要な物質の例：高級車のイリジウムプラグ、国際キログラム原器（旧標準）、高級万年筆のペン先、大型有機LEDの発光材料、坩堝（結晶成長用）", electrons: [2, 8, 18, 32, 15, 2] },
  { no: 78, symbol: "Pt", name: "白金", info: "プラチナの名で知られる高級貴金属。宝飾品だけでなく、自動車の排ガスを綺麗にする触媒や、抗がん剤の成分として大活躍。主要な物質の例：プラチナ指輪、自動車の排ガス浄化触媒、抗がん剤（シスプラチン）、燃料電池の電極、ハードディスクの磁気層材料", electrons: [2, 8, 18, 32, 17, 1] },
  { no: 79, symbol: "Au", name: "金", info: "人類を魅了し続ける不滅の貴金属。サビず、電気を非常によく通すため、スマホ内部の最高級ICチップの配線に必須。主要な物質の例：結婚指輪・金塊、スマートフォン内部のIC金線、金歯、高級ウイスキーの金箔、金めっきコネクタ", electrons: [2, 8, 18, 32, 18, 1] },
  { no: 80, symbol: "Hg", name: "水銀", info: "常温で唯一「液体」の金属。かつては体温計や蛍光灯に使われてきましたが、現在は環境保護により規制が進んでいます。主要な物質の例：昔の水銀体温計、蛍光灯の内部蒸気、アマルガム（昔の歯の詰め物）、神社鳥居の朱色絵の具（硫化水銀）、気圧計", electrons: [2, 8, 18, 32, 18, 2] },
  { no: 81, symbol: "Tl", name: "タリウム", info: "かつて殺鼠剤として使われた猛毒の金属。光ファイバーの屈折率を制御するガラスの添加剤に用いられます。主要な物質の例：光ファイバーの添加剤、医療用心筋シンチグラフィ、超高屈折率光学ガラス、赤外線透過フィルター、高温超伝導体", electrons: [2, 8, 18, 32, 18, 3] },
  { no: 82, symbol: "Pb", name: "鉛", info: "重く柔らかい金属。放射線を遮る能力が高く、レントゲン室の壁や、車のバッテリーに使われます。主要な物質の例：自動車の鉛蓄電池、レントゲン室の防護服（鉛シート）、釣りの重り、ハンダ（昔の鉛入り）、放射線遮蔽ブロック", electrons: [2, 8, 18, 32, 18, 4] },
  { no: 83, symbol: "Bi", name: "ビスマス", info: "結晶を作ると、酸化膜によって美しい虹色に輝く独特の金属。胃薬の成分にもなります。主要な物質の例：ビスマス虹色結晶（インテリア）、胃薬（次硝酸ビスマス）、スプリンクラーの低融点ヒューズ、鉛代替の無鉛ハンダ、化粧品のパール剤", electrons: [2, 8, 18, 32, 18, 5] },
  { no: 84, symbol: "Po", name: "ポロニウム", info: "キュリー夫人により発見された激しい放射線を出す超猛毒元素。精密工場の静電気除去ブラシなどに極微量利用。主要な物質の例：印刷・フィルム工場の静電気除去ブラシ、宇宙探査機の熱源電池、核兵器の初期中性子点火器、研究用アルファ線源", electrons: [2, 8, 18, 32, 18, 6] },
  { no: 85, symbol: "At", name: "アスタチン", info: "地球上に合計しても数十グラムほどしか存在しない超希少元素。がんの放射線治療で大注目されています。主要な物質の例：がんの標的アルファ線治療薬（先端医療）、放射性同位体追跡子、加速器合成標的、重粒子線研究、超微量ハロゲン化学研究", electrons: [2, 8, 18, 32, 18, 7] },
  { no: 86, symbol: "Rn", name: "ラドン", info: "最も重い希ガス。放射性を持ち、温泉の健康効果をうたう成分として有名です。主要な物質の例：ラドン温泉（三朝温泉など）、ラジウム岩盤浴（崩壊ガス）、地震予知の地下水観測、大気移動のトレーサー気体、放射線がん治療（過去）", electrons: [2, 8, 18, 32, 18, 8] },
  { no: 87, symbol: "Fr", name: "フランシウム", info: "一瞬だけ生まれる、極めて不安定なアルカリ金属。地球上の存在量がワースト2位の幻の元素。主要な物質の例：レーザートラップによる原子構造研究、加速器による一瞬の合成標的、ウラン鉱石中の微量崩壊生成物、超重元素の化学挙動研究、原子核物理実験", electrons: [2, 8, 18, 32, 18, 8, 1] },
  { no: 88, symbol: "Ra", name: "ラジウム", info: "キュリー夫妻が発見。暗闇で光るためかつて夜光塗料に使われ、ラジウム温泉の元としても知られる放射性金属。主要な物質の例：ラジウム温泉の湯の華、がんの針状放射線治療源、昔の夜光時計の文字盤、ラジウム鉱石（北投石）、歴史的放射線研究材料", electrons: [2, 8, 18, 32, 18, 8, 2] },
  { no: 89, symbol: "Ac", name: "アクチニウム", info: "アクチノイドの先頭。強いアルファ線を放ち、がん細胞を狙い撃ちする新しいがん治療の薬として熱い視線を浴びています。主要な物質の例：標的アルファ線がん治療薬、宇宙探査機用熱電発電機（試作）、中性子発生源の起動材、海洋深層循環の放射性トレーサー、核物理学研究用ターゲット", electrons: [2, 8, 18, 32, 18, 9, 2] },
  { no: 90, symbol: "Th", name: "トリウム", info: "ウランに代わる安全な原発の次世代燃料として期待が集まっている放射性元素。主要な物質の例：次世代トリウム溶融塩原発燃料、高級カメラのオールドレンズ（トリウムガラス）、ガスランタンのマントル（発光体）、タングステン溶接棒の添加剤、耐熱セラミックるつぼ", electrons: [2, 8, 18, 32, 18, 10, 2] },
  { no: 91, symbol: "Pa", name: "プロトアクチニウム", info: "極めて希少で、強い放射性と毒性を持つため研究用途のみ。主要な物質の例：深海堆積物の年代測定（地質学）、ウラン崩壊系列の中間生成物、核燃料サイクル研究用サンプル、高放射性物質研究用ターゲット、原子核物理実験データ", electrons: [2, 8, 18, 32, 20, 9, 2] },
  { no: 92, symbol: "U", name: "ウラン", info: "天然に存在する最も重い元素。原子力発電所の燃料として、莫大なエネルギーを生み出す社会のエネルギー源。主要な物質の例：原子力発電所のウラン燃料、ウランガラス（緑色に光る骨董品）、昔の黄色い陶器の釉薬、劣化ウラン弾（軍事用重錘）、地球の岩石年代測定", electrons: [2, 8, 18, 32, 21, 9, 2] },
  { no: 93, symbol: "Np", name: "ネプツニウム", info: "人工的に作られた最初の超ウラン元素。プルトニウムが生まれる途中の副産物。主要な物質の例：高感度中性子検出器、高速増殖炉の核燃料研究、プルトニウム238製造用ターゲット、超ウラン元素の化学研究、放射性廃棄物長期挙動解析", electrons: [2, 8, 18, 32, 22, 9, 2] },
  { no: 94, symbol: "Pu", name: "プルトニウム", info: "ウラン燃料の燃え残りから生まれる。極めて強い放射能と毒性を持ち、原子力発電のプルサーマル燃料などに使われます。主要な物質の例：原子力原発のMOX燃料、宇宙探査機（ボイジャー等）の原子力電池、超ウラン化学研究、放射性トレーサー（極微量）", electrons: [2, 8, 18, 32, 24, 8, 2] },
  { no: 95, symbol: "Am", name: "アメリシウム", info: "アメリカ大陸から命名。煙を感知する能力が凄まじく、海外の一般家庭の「煙探知機」のセンサーに広く使われています。主要な物質の例：家庭用イオン化式煙探知機、工場のプラスチック厚さ計、ガラス製造用密度計、航空機燃料の水分計、中性子水分計の線源", electrons: [2, 8, 18, 32, 25, 8, 2] },
  { no: 96, symbol: "Cm", name: "キュリウム", info: "強力な放射線熱を出すため、宇宙探査機の分析機器のアルファ線源に使用。主要な物質の例：火星ローバーのAPXS（アルファ線X線分光器）、小惑星探査機の地質分析センサー、人工衛星の同位体熱源、カリホルニウム合成の原材料、超重ウラン物理実験の標的", electrons: [2, 8, 18, 32, 25, 9, 2] },
  { no: 97, symbol: "Bk", name: "バークリウム", info: "これ自体に実用用途はなく、さらに重い元素を合成するためのターゲット材料になります。主要な物質の例：テネシン（117番）合成用ターゲット、超重元素合成実験の衝突材料、ローレンシウム研究の出発物質、人工放射性核種研究、アクチノイド化学分析", electrons: [2, 8, 18, 32, 27, 8, 2] },
  { no: 98, symbol: "Cf", name: "カリホルニウム", info: "大量の中性子を放出する。超小型の放射線源として、航空機の機体検査や、地質調査に使われる高級元素。主要な物質の例：原発の原子炉起動用中性子源、航空機主翼の亀裂検査用線源、中性子水分計、製鉄・セメントのオンライン元素分析、がんの局所中性子線治療（研究）", electrons: [2, 8, 18, 32, 28, 8, 2] },
  { no: 99, symbol: "Es", name: "アインシュタニウム", info: "水爆実験の塵から発見されました。目に見える量を作れる限界に近い、超重い人工元素。主要な物質の例：メンデレビウム（101番）合成用ターゲット、アインシュタニウムアジド（化合物研究）、重イオン加速器の衝突実験源、超ウラン元素結晶構造解析、原子核物理学基礎データ", electrons: [2, 8, 18, 32, 29, 8, 2] },
  { no: 100, symbol: "Fm", name: "フェルミウム", info: "これより先は中性子吸収では作れず、加速器による強引な原子同士の衝突合成が必要になります。主要な物質の例：加速器による超重元素合成の研究ターゲット、重イオン衝突実験の基礎データ、アクチノイド化学挙動分析、フェルミウム同位体半減期測定、原子核構造論の検証", electrons: [2, 8, 18, 32, 30, 8, 2] },
  { no: 101, symbol: "Md", name: "メンデレビウム", info: "周期表の生みの親メンデレーエフを称えて命名。加速器で1回に数個〜数十個しか作れない幻の超重元素。主要な物質の例：超重原子核物理実験の測定ターゲット、メンデレビウム錯体の溶液化学研究、反跳法による原子隔離実験、イオン交換クロマトグラフィの分離パターン、極微量超ウラン元素物性解析", electrons: [2, 8, 18, 32, 31, 8, 2] },
  { no: 102, symbol: "No", name: "ノーベリウム", info: "非常に寿命が短く、数秒から数分で他の軽い元素に崩壊してしまいます。主要な物質の例：ノーベリウムの気相化学反応実験、価電子配置の分光測定（研究）、加速器一体型反跳分離装置での検出、アクチノイドからローレンシウムへの化学的架橋研究、原子核崩壊特性の計測", electrons: [2, 8, 18, 32, 32, 8, 2] },
  { no: 103, symbol: "Lr", name: "ローレンシウム", info: "アクチノイド系列の最後の元素です。研究用途以外には地球上に存在しません。主要な物質の例：ローレンシウムの第1イオン化エネルギー測定実験、14族類似性の検証実験、超重元素揮発性調査の標的、加速器による一瞬の合成検出、重原子核構造の理論検証", electrons: [2, 8, 18, 32, 32, 9, 2] },
  { no: 104, symbol: "Rf", name: "ラザホジウム", info: "超重元素のトップバッター。半減期はわずか数秒で、実用用途はありません。主要な物質の例：4族との化学的類似性実験、自動高速液体クロマトグラフィの分離テスト、ラザホジウム揮発性塩化物生成実験、超重原子核の自発核分裂寿命計測、重イオン加速器の反応生成物", electrons: [2, 8, 18, 32, 32, 12, 2] },
  { no: 105, symbol: "Db", name: "ドブニウム", info: "ロシアの都市ドゥブナから命名。強烈な放射性を持ち、性質の詳細は未だ謎に包まれています。主要な物質の例：5族との化学平衡抽出実験、ドブニウム臭化物の揮発性調査、加速器を用いた壊変系列追跡、自発核分裂確率のオンライン測定、超重原子核物理学理論の補正", electrons: [2, 8, 18, 32, 32, 13, 2] },
  { no: 106, symbol: "Sg", name: "シーボーギウム", info: "存命中の人物の名が元素に付けられた初の例。タングステンの下に位置します。主要な物質の例：シーボーギウムカルボニル錯体の合成（歴史的実験）、6族揮発性酸化物の比較実験、自動迅速イオン交換分離、超重原子核のアルファ崩壊エネルギー測定、重イオン衝突断面積データ", electrons: [2, 8, 18, 32, 32, 14, 2] },
  { no: 107, symbol: "Bh", name: "ボーリウム", info: "量子力学の巨人ニールス・ボーアから命名。重い原子同士を衝突させて合成します。主要な物質の例：ボーリウム揮発性オキシ塩化物の気相化学実験、7族（レニウム）との類似性比較、オンラインガス吸着クロマトグラフィ、超微量壊変イベントの時系列解析、重イオン融合反応の研究データ", electrons: [2, 8, 18, 32, 32, 15, 2] },
  { no: 108, symbol: "Hs", name: "ハッシウム", info: "オスミウムに似た揮発性の酸化物を作ることが確認されている超重元素。主要な物質の例：四酸化ハッシウム気体の堆積サーモクロマトグラフィ実験、8族類似性の立証サンプル、半導体検出器によるオンライン崩壊追跡、超重核の殻エネルギー検証、重イオン融合理論の境界調査", electrons: [2, 8, 18, 32, 32, 16, 2] },
  { no: 109, symbol: "Mt", name: "マイトネリウム", info: "女性物理学者リーゼ・マイトナーを記念。世界でこれまで数個しか合成に成功していません。主要な物質の例：重イオン加速器による一瞬の合成イベント検出、マイトネリウムのアルファ崩壊エネルギー計測、周期表9族（イリジウム）の延長線予測、超重核分裂特性の調査、未来の化学実験用予測データ", electrons: [2, 8, 18, 32, 32, 17, 2] },
  { no: 110, symbol: "Ds", name: "ダームスタチウム", info: "白金と同じ「10族」の性質を持つと予想されています。主要な物質の例：加速器による10族超重金属の核合成実験、ニッケル・白金との最外殻電子相関理論の検証、ダームスタチウム崩壊生成物の追跡、超重原子核質量公式の適合テスト、超重元素研究の軌跡データ", electrons: [2, 8, 18, 32, 32, 17, 2] },
  { no: 111, symbol: "Rg", name: "レントゲニウム", info: "銅や金と同じ「11族」に属するため、超重い貴金属のような性質を持つと考えされています。主要な物質の例：11族の超重相対論的効果の計算検証、重イオン融合による一瞬の合成検出、レントゲニウム同位体の崩壊ルート解析、原子核安定の島へ向けた中性子数実験、加速器ターゲット衝突物理データ", electrons: [2, 8, 18, 32, 32, 18, 1] },
  { no: 112, symbol: "Cn", name: "コペルニシウム", info: "亜鉛や水銀の真下に位置するため、常温で気体か液体の、揮発性の高い金属だと予想されています。主要な物質の例：金表面へのコペルニシウム気体吸着オンライン実験（揮発性証明）、水銀との相対論的効果比較、常温気体金属挙動の理論計算、コペルニシウム283の自発核分裂計測、重イオン線型加速器の合成出力", electrons: [2, 8, 18, 32, 32, 18, 2] },
  { no: 113, symbol: "Nh", name: "ニホニウム", info: "日本（理化学研究所）が発見し、アジア初の命名権を獲得した記念すべき元素。主要な物質の例：理化学研究所のGARIS加速器合成イベント、ニホニウム286のアルファ連続崩壊鎖、13族（タリウム）との化学的性質比較計算、超重元素溶液化学の予備実験、日本発の原子核物理フラッグシップデータ", electrons: [2, 8, 18, 32, 32, 18, 3] },
  { no: 114, symbol: "Fl", name: "フレロビウム", info: "鉛の真下に位置し、非常に重く、数秒で崩壊する人工元素。主要な物質の例：フレロビウムの金・気相吸着サーモクロマトグラフィ、14族不活性電子対効果の検証計算、フレロビウム289の長寿命同位体研究、原子核「安定の島」の南端境界調査、ロシア・米国共同核物理実験データ", electrons: [2, 8, 18, 32, 32, 18, 4] },
  { no: 115, symbol: "Mc", name: "モスコビウム", info: "モスクワ州から命名。窒素やビスマスの真下に位置する「15族」の超不安定人工元素。主要な物質の例：ドブニウムの親核種としてのモスコビウム合成実験、15族超重元素の相対論的分子軌道計算、モスコビウム288のアルファ壊変挙動の追跡、超重元素合成用アメリシウムターゲット照射実験、多重反射型タイムオブフライト質量測定", electrons: [2, 8, 18, 32, 32, 18, 5] },
  { no: 116, symbol: "Lv", name: "リバモリウム", info: "酸素や硫黄と同じ「16族」に属する、寿命わずか数ミリ秒の超重人工元素。主要な物質の例：フレロビウムへの崩壊出発点としてのリバモリウム核反応、キュリウム・カルシウム衝突による超重核合成、16族（ポロニウム真下）の電子殻配置研究、ミリ秒単位の超高速反跳分離測定、重イオン線型加速器の極限出力イベント", electrons: [2, 8, 18, 32, 32, 18, 6] },
  { no: 117, symbol: "Ts", name: "テネシン", info: "フッ素やヨウ素と同じ「17族（ハロゲン）」に属し、世界で2番目に重い人工元素。主要な物質の例：バークリウムターゲットへのカルシウムビーム照射実験（テネシン合成）、17族ハロゲン極限の電子親和力理論計算、テネシン294のアルファ崩壊エネルギー解析、原子核安定の島への東側アプローチ、超重元素探索の国際共同プロジェクトデータ", electrons: [2, 8, 18, 32, 32, 18, 7] },
  { no: 118, symbol: "Og", name: "オガネソン", info: "現在周期表の右下を締めくくる118番目の最重元素。希ガスに属し、非常に高い反応性を持つ可能性が示唆されています。主要な物質の例：カリホルニウム・カルシウム衝突による史上最重原子核の合成、オガネソンの相対論的電子殻「全電子の平滑化」理論モデル、118番希ガス極限の分極率計算、超重元素の終着点探索データ、近未来の119番元素発見への足がかり基礎研究", electrons: [2, 8, 18, 32, 32, 18, 8] },
];

const mainTableLayout = [
  { isRowLabel: true, text: "1" }, { no: 1 }, { space: true, count: 16 }, { no: 2 },
  { isRowLabel: true, text: "2" }, { no: 3 }, { no: 4 }, { space: true, count: 10 }, { no: 5 }, { no: 6 }, { no: 7 }, { no: 8 }, { no: 9 }, { no: 10 },
  { isRowLabel: true, text: "3" }, { no: 11 }, { no: 12 }, { space: true, count: 10 }, { no: 13 }, { no: 14 }, { no: 15 }, { no: 16 }, { no: 17 }, { no: 18 },
  { isRowLabel: true, text: "4" }, { no: 19 }, { no: 20 }, { no: 21 }, { no: 22 }, { no: 23 }, { no: 24 }, { no: 25 }, { no: 26 }, { no: 27 }, { no: 28 }, { no: 29 }, { no: 30 }, { no: 31 }, { no: 32 }, { no: 33 }, { no: 34 }, { no: 35 }, { no: 36 },
  { isRowLabel: true, text: "5" }, { no: 37 }, { no: 38 }, { no: 39 }, { no: 40 }, { no: 41 }, { no: 42 }, { no: 43 }, { no: 44 }, { no: 45 }, { no: 46 }, { no: 47 }, { no: 48 }, { no: 49 }, { no: 50 }, { no: 51 }, { no: 52 }, { no: 53 }, { no: 54 },
  { isRowLabel: true, text: "6" }, { no: 55 }, { no: 56 }, { isLabel: true, text: "※1" }, { no: 72 }, { no: 73 }, { no: 74 }, { no: 75 }, { no: 76 }, { no: 77 }, { no: 78 }, { no: 79 }, { no: 80 }, { no: 81 }, { no: 82 }, { no: 83 }, { no: 84 }, { no: 85 }, { no: 86 },
  { isRowLabel: true, text: "7" }, { no: 87 }, { no: 88 }, { isLabel: true, text: "※2" }, { no: 104 }, { no: 105 }, { no: 106 }, { no: 107 }, { no: 108 }, { no: 109 }, { no: 110 }, { no: 111 }, { no: 112 }, { no: 113 }, { no: 114 }, { no: 115 }, { no: 116 }, { no: 117 }, { no: 118 },
];

const lanthanoids = [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71];
const actinoids = [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103];

function ElectronDiagram({ electrons }) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const shellRadii = [22, 37, 52, 65, 77, 88, 98];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "#0a0a14", borderRadius: "50%", flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={14} fill="#e63946" />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">+</text>
      {electrons.map((count, si) => {
        const r = shellRadii[si] || (shellRadii[shellRadii.length - 1] + (si - shellRadii.length + 1) * 10);
        return (
          <g key={si}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a2a4a" strokeWidth="0.8" strokeDasharray="2,2" />
            {Array.from({ length: count }).map((_, ei) => {
              const angle = (ei * 2 * Math.PI) / count - Math.PI / 2;
              const ex = cx + r * Math.cos(angle);
              const ey = cy + r * Math.sin(angle);
              return <circle key={ei} cx={ex} cy={ey} r={3.5} fill="#00e5a0" />;
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function App() {
  const [appMode, setAppMode] = useState("EXPLORE");
  const [selectedEl, setSelectedEl] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("favorites") || "[]"); } catch { return []; }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategory, setShowCategory] = useState("ALL");
  const [gameState, setGameState] = useState("SELECT_MODE");
  const [quizList, setQuizList] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isFourChoice, setIsFourChoice] = useState(true);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [playedCount, setPlayedCount] = useState(0);
  const [startNo, setStartNo] = useState(1);
  const [endNo, setEndNo] = useState(118);
  const [rangeError, setRangeError] = useState("");
  const [quizStats, setQuizStats] = useState({ total: 0, correct: 0 });
  const inputRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem("favorites", JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  const toggleFavorite = (no) => {
    setFavorites(prev => prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]);
  };

  const matchesSearch = (el) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return el.name.includes(q) || el.symbol.toLowerCase().includes(q) || String(el.no).includes(q);
  };

  const matchesCategory = (el) => {
    if (showCategory === "ALL") return true;
    if (showCategory === "FAV") return favorites.includes(el.no);
    return getCategory(el.no) === showCategory;
  };

  const isHighlighted = (no) => {
    const el = questions.find(q => q.no === no);
    if (!el) return false;
    if (appMode === "QUIZ") return no >= startNo && no <= endNo;
    return matchesSearch(el) && matchesCategory(el);
  };

  const handleElementClick = (no) => {
    const found = questions.find(q => q.no === no);
    if (!found) return;
    if (appMode === "EXPLORE") {
      setSelectedEl(found);
    } else {
      if (startNo === endNo || no < startNo) setStartNo(no);
      else setEndNo(no);
    }
  };

  useEffect(() => {
    if (!quizList[quizIndex]) return;
    const correct = quizList[quizIndex].symbol;
    const wrong = questions.filter(q => q.symbol !== correct).map(q => q.symbol).sort(() => Math.random() - 0.5).slice(0, 3);
    setChoices([correct, ...wrong].sort(() => Math.random() - 0.5));
  }, [quizList, quizIndex]);

  const startGame = (fourChoice) => {
    if (startNo > endNo || startNo < 1 || endNo > 118) { setRangeError("有効な範囲を指定してください（1〜118）"); return; }
    setRangeError("");
    setIsFourChoice(fourChoice);
    const filtered = questions.filter(q => q.no >= startNo && q.no <= endNo);
    setQuizList([...filtered].sort(() => Math.random() - 0.5));
    setQuizIndex(0); setInput(""); setResult(""); setScore(0); setHasAnswered(false); setPlayedCount(0);
    setGameState("PLAYING");
  };

  const checkAnswer = (ans) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    setPlayedCount(p => p + 1);
    const correct = quizList[quizIndex].symbol;
    const isCorrect = ans.trim().toUpperCase() === correct.toUpperCase();
    if (isCorrect) { setScore(s => s + 1); setResult("正解！"); setQuizStats(s => ({ total: s.total + 1, correct: s.correct + 1 })); }
    else { setResult(`不正解  正解は ${correct}`); setQuizStats(s => ({ total: s.total + 1, correct: s.correct })); }
  };

  const nextQ = () => {
    if (quizIndex + 1 < quizList.length) { setQuizIndex(i => i + 1); setInput(""); setResult(""); setHasAnswered(false); }
    else setGameState("FINISHED");
  };

  useEffect(() => {
    if (gameState === "PLAYING" && !isFourChoice && inputRef.current) inputRef.current.focus();
  }, [gameState, quizIndex, isFourChoice]);

  const elBtnStyle = (no, extraHighlight = false) => {
    const cat = getCategory(no);
    const catColor = CATEGORY_COLORS[cat];
    const hi = isHighlighted(no);
    const isFav = favorites.includes(no);
    return {
      aspectRatio: "1/1",
      background: extraHighlight ? "#4444ff" : hi ? `${catColor.bg}` : "#1c1c2a",
      border: extraHighlight ? "2px solid #00ffff" : hi ? `1.5px solid ${catColor.border}` : "1px solid #2d2d3d",
      borderRadius: "6px",
      color: "white",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "4px 3px",
      transition: "all 0.12s",
      position: "relative",
      boxSizing: "border-box",
      minWidth: 0,
    };
  };

  const ElBtn = ({ no }) => {
    const el = questions.find(q => q.no === no);
    if (!el) return null;
    const isQuizRange = appMode === "QUIZ" && no >= startNo && no <= endNo;
    return (
      <button onClick={() => handleElementClick(no)} style={elBtnStyle(no, isQuizRange)} title={el.name}>
        {favorites.includes(no) && <span style={{ position: "absolute", top: 1, right: 2, fontSize: "7px", color: "#ffd700" }}>★</span>}
        <span style={{ fontSize: "9px", opacity: 0.6, alignSelf: "flex-start", fontWeight: "bold", lineHeight: 1 }}>{no}</span>
        <span style={{ fontSize: "13px", fontWeight: "bold", lineHeight: "1", textAlign: "center" }}>{el.symbol}</span>
        <span style={{ fontSize: "8px", opacity: 0.85, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", width: "100%", textAlign: "center" }}>{el.name}</span>
      </button>
    );
  };

  const accuracy = quizStats.total > 0 ? Math.round((quizStats.correct / quizStats.total) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "white", fontFamily: "'Noto Sans JP', sans-serif", padding: "16px", boxSizing: "border-box" }}>
      
      {/* ヘッダー */}
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "bold", color: "#e0e0ff" }}>
            ⚛️ 元素周期表 図鑑＆クイズ
          </h1>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {quizStats.total > 0 && (
              <div style={{ background: "#1a1a2e", border: "1px solid #2d2d4d", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", color: "#aaa" }}>
                累計 <span style={{ color: "#00e5a0", fontWeight: "bold" }}>{quizStats.correct}</span>/{quizStats.total} ({accuracy}%)
              </div>
            )}
            <button onClick={() => { setAppMode("EXPLORE"); setGameState("SELECT_MODE"); }}
              style={{ padding: "8px 20px", fontSize: "14px", borderRadius: "8px", border: "none", background: appMode === "EXPLORE" && gameState === "SELECT_MODE" ? "#ffaa00" : "#1a1a2e", color: appMode === "EXPLORE" && gameState === "SELECT_MODE" ? "#111" : "white", fontWeight: "bold", cursor: "pointer", border: "1px solid #2d2d4d" }}>
              📖 図鑑
            </button>
            <button onClick={() => { setAppMode("QUIZ"); setGameState("SELECT_MODE"); }}
              style={{ padding: "8px 20px", fontSize: "14px", borderRadius: "8px", border: "none", background: appMode === "QUIZ" && gameState === "SELECT_MODE" ? "#5555ff" : "#1a1a2e", color: "white", fontWeight: "bold", cursor: "pointer", border: "1px solid #2d2d4d" }}>
              🎯 クイズ
            </button>
          </div>
        </div>

        {/* メイン画面 */}
        {gameState === "SELECT_MODE" && (
          <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>

            {/* 検索・フィルター（図鑑モードのみ） */}
            {appMode === "EXPLORE" && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="🔍  元素名・記号・番号で検索"
                  style={{ padding: "8px 14px", fontSize: "14px", borderRadius: "8px", border: "1px solid #2d2d4d", background: "#1a1a2e", color: "white", width: "220px", outline: "none" }}
                />
                <select value={showCategory} onChange={e => setShowCategory(e.target.value)}
                  style={{ padding: "8px 12px", fontSize: "13px", borderRadius: "8px", border: "1px solid #2d2d4d", background: "#1a1a2e", color: "white", cursor: "pointer" }}>
                  <option value="ALL">全カテゴリー</option>
                  <option value="FAV">★ お気に入り ({favorites.length})</option>
                  {Object.entries(CATEGORY_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                {/* 凡例 */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {Object.entries(CATEGORY_COLORS).slice(0, 5).map(([k, v]) => (
                    <span key={k} style={{ padding: "3px 8px", fontSize: "11px", borderRadius: "4px", background: v.bg, border: `1px solid ${v.border}`, color: v.border, fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => setShowCategory(k === showCategory ? "ALL" : k)}>
                      {v.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 周期表 */}
            <div style={{ background: "#12121e", borderRadius: "16px", padding: "16px", border: "1px solid #2d2d4d", overflowX: "auto" }}>
              
              {/* 族ラベル */}
              <div style={{ display: "grid", gridTemplateColumns: "36px repeat(18, minmax(0, 1fr))", gap: "4px", marginBottom: "4px", minWidth: "720px" }}>
                <div />
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} style={{ fontSize: "10px", color: "#555", textAlign: "center" }}>{i + 1}</div>
                ))}
              </div>

              {/* メイン周期表 */}
              <div style={{ display: "grid", gridTemplateColumns: "36px repeat(18, minmax(0, 1fr))", gap: "4px", marginBottom: "16px", minWidth: "720px" }}>
                {mainTableLayout.map((item, idx) => {
                  if ('isRowLabel' in item) return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#555", fontWeight: "bold" }}>{item.text}</div>
                  );
                  if ('space' in item) return <div key={idx} style={{ gridColumn: `span ${item.count}` }} />;
                  if ('isLabel' in item) return (
                    <div key={idx} style={{ aspectRatio: "1/1", background: "#0d0d1a", border: "1px dashed #333", borderRadius: "6px", color: "#666", fontSize: "9px", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center" }}>{item.text}</div>
                  );
                  return <ElBtn key={idx} no={item.no} />;
                })}
              </div>

              {/* ランタノイド・アクチノイド */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "720px" }}>
                {[
                  { nos: lanthanoids, label: "※1 ランタノイド", color: CATEGORY_COLORS.lanthanoid.border },
                  { nos: actinoids, label: "※2 アクチノイド", color: CATEGORY_COLORS.actinoid.border },
                ].map(({ nos, label, color }) => (
                  <div key={label} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <div style={{ width: "120px", fontSize: "11px", color, textAlign: "right", paddingRight: "10px", fontWeight: "bold", flexShrink: 0 }}>{label}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(15, minmax(0, 1fr))", gap: "4px", flex: 1 }}>
                      {nos.map(no => <ElBtn key={no} no={no} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* クイズ設定 */}
            {appMode === "QUIZ" && (
              <div style={{ background: "#12121e", borderRadius: "12px", padding: "20px", border: "1px solid #2d2d4d" }}>
                <p style={{ margin: "0 0 12px 0", color: "#aaa", fontSize: "14px" }}>周期表をクリックして範囲を指定するか、番号を直接入力してください。</p>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input type="number" min="1" max="118" value={startNo} onChange={e => setStartNo(Number(e.target.value))}
                      style={{ width: "70px", padding: "8px", fontSize: "16px", borderRadius: "8px", textAlign: "center", border: "1px solid #444", background: "#1a1a2e", color: "white" }} />
                    <span style={{ color: "#888" }}>〜</span>
                    <input type="number" min="1" max="118" value={endNo} onChange={e => setEndNo(Number(e.target.value))}
                      style={{ width: "70px", padding: "8px", fontSize: "16px", borderRadius: "8px", textAlign: "center", border: "1px solid #444", background: "#1a1a2e", color: "white" }} />
                    <span style={{ color: "#888", fontSize: "13px" }}>番 ({endNo - startNo + 1}問)</span>
                  </div>
                  <button onClick={() => { setStartNo(1); setEndNo(118); }} style={{ padding: "8px 16px", fontSize: "13px", borderRadius: "8px", border: "1px solid #444", background: "#1a1a2e", color: "white", cursor: "pointer" }}>全選択</button>
                  <button onClick={() => { setStartNo(1); setEndNo(36); }} style={{ padding: "8px 16px", fontSize: "13px", borderRadius: "8px", border: "1px solid #444", background: "#1a1a2e", color: "white", cursor: "pointer" }}>1〜36番</button>
                  <button onClick={() => { setStartNo(1); setEndNo(20); }} style={{ padding: "8px 16px", fontSize: "13px", borderRadius: "8px", border: "1px solid #444", background: "#1a1a2e", color: "white", cursor: "pointer" }}>1〜20番</button>
                </div>
                {rangeError && <p style={{ color: "#ff4444", fontSize: "13px", margin: "10px 0 0 0" }}>⚠️ {rangeError}</p>}
                <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
                  <button onClick={() => startGame(true)} style={{ flex: 1, padding: "16px", fontSize: "18px", borderRadius: "12px", border: "none", background: "#5555ff", color: "white", cursor: "pointer", fontWeight: "bold" }}>🧩 4択モード</button>
                  <button onClick={() => startGame(false)} style={{ flex: 1, padding: "16px", fontSize: "18px", borderRadius: "12px", border: "none", background: "#00aa66", color: "white", cursor: "pointer", fontWeight: "bold" }}>⌨️ 入力モード</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* クイズプレイ画面 */}
        {gameState === "PLAYING" && (
          <div style={{ maxWidth: "560px", margin: "0 auto", background: "#12121e", border: "1px solid #2d2d4d", padding: "32px", borderRadius: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ color: "#aaa", fontSize: "14px" }}>問 <strong style={{ color: "white", fontSize: "18px" }}>{quizIndex + 1}</strong>/{quizList.length}</span>
              <span style={{ color: "#00e5a0", fontSize: "14px" }}>✓ {score}</span>
              <button onClick={() => setGameState("FINISHED")} style={{ padding: "6px 14px", fontSize: "13px", borderRadius: "8px", border: "1px solid #ff4444", background: "transparent", color: "#ff4444", cursor: "pointer" }}>中断</button>
            </div>
            <p style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "32px", textAlign: "center" }}>
              「<span style={{ color: "#ffaa00" }}>{quizList[quizIndex]?.name}</span>」の元素記号は？
            </p>
            {isFourChoice ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
                {choices.map((c, i) => {
                  let bg = "#1a1a2e";
                  if (hasAnswered) {
                    if (c === quizList[quizIndex].symbol) bg = "#00aa6688";
                    else bg = "#1a1a2e";
                  }
                  return (
                    <button key={i} onClick={() => checkAnswer(c)} disabled={hasAnswered}
                      style={{ padding: "18px", fontSize: "24px", fontWeight: "bold", borderRadius: "10px", border: `1px solid ${hasAnswered && c === quizList[quizIndex].symbol ? "#00aa66" : "#2d2d4d"}`, background: bg, color: "white", cursor: hasAnswered ? "default" : "pointer" }}>
                      {c}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !hasAnswered && checkAnswer(input)} disabled={hasAnswered}
                  placeholder="元素記号を入力"
                  style={{ padding: "14px", width: "180px", fontSize: "22px", borderRadius: "10px", border: "1px solid #444", background: "#1a1a2e", color: "white", fontWeight: "bold", textAlign: "center", outline: "none" }} />
                {!hasAnswered && (
                  <button onClick={() => checkAnswer(input)} style={{ display: "block", margin: "14px auto 0", padding: "12px 32px", fontSize: "16px", borderRadius: "10px", border: "none", background: "#00aa66", color: "white", cursor: "pointer", fontWeight: "bold" }}>答え合わせ</button>
                )}
              </div>
            )}
            {result && (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <p style={{ fontSize: "22px", fontWeight: "bold", color: result.includes("正解") ? "#00e5a0" : "#ff6b6b", margin: "0 0 14px 0" }}>
                  {result.includes("正解") ? "⭕ " : "❌ "}{result}
                </p>
                <div style={{ background: "#0d0d1a", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#aaa", textAlign: "left" }}>
                  {quizList[quizIndex]?.info.split("主要な物質の例：")[0]}
                </div>
              </div>
            )}
            {hasAnswered && (
              <button onClick={nextQ} style={{ width: "100%", padding: "14px", fontSize: "17px", borderRadius: "10px", border: "none", background: "#5555ff", color: "white", cursor: "pointer", fontWeight: "bold" }}>
                {quizIndex + 1 === quizList.length ? "結果を見る 🏁" : "次の問題 →"}
              </button>
            )}
          </div>
        )}

        {/* リザルト画面 */}
        {gameState === "FINISHED" && (
          <div style={{ maxWidth: "480px", margin: "0 auto", background: "#12121e", border: "1px solid #2d2d4d", padding: "36px", borderRadius: "20px", textAlign: "center" }}>
            <h2 style={{ fontSize: "36px", color: "#ffd700", margin: "0 0 16px 0" }}>🎉 クイズ終了！</h2>
            <p style={{ color: "#aaa", marginBottom: "24px", fontSize: "15px" }}>範囲: {startNo}番 〜 {endNo}番</p>
            <div style={{ fontSize: "20px", marginBottom: "16px" }}>
              今回: <span style={{ color: "#00e5a0", fontSize: "42px", fontWeight: "bold" }}>{score}</span> / {playedCount} 問
            </div>
            {quizStats.total > 0 && (
              <div style={{ background: "#0d0d1a", borderRadius: "10px", padding: "14px", marginBottom: "24px", fontSize: "14px", color: "#aaa" }}>
                累計正解率: <span style={{ color: "#ffaa00", fontWeight: "bold", fontSize: "18px" }}>{accuracy}%</span>
                <span style={{ marginLeft: "12px" }}>({quizStats.correct}/{quizStats.total}問)</span>
              </div>
            )}
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => { setAppMode("QUIZ"); setGameState("SELECT_MODE"); }} style={{ flex: 1, padding: "14px", fontSize: "16px", borderRadius: "10px", border: "none", background: "#5555ff", color: "white", cursor: "pointer", fontWeight: "bold" }}>もう一度</button>
              <button onClick={() => { setAppMode("EXPLORE"); setGameState("SELECT_MODE"); }} style={{ flex: 1, padding: "14px", fontSize: "16px", borderRadius: "10px", border: "none", background: "#ffaa00", color: "#111", cursor: "pointer", fontWeight: "bold" }}>図鑑を見る</button>
            </div>
          </div>
        )}
      </div>

      {/* 解説モーダル（横長レイアウト） */}
      {selectedEl && (
        <div onClick={() => setSelectedEl(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 200, padding: "16px" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "820px", background: "#12121e", border: `2px solid ${CATEGORY_COLORS[getCategory(selectedEl.no)].border}`, borderRadius: "20px", overflow: "hidden", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            
            {/* ヘッダー */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 14px", borderBottom: `1px solid ${CATEGORY_COLORS[getCategory(selectedEl.no)].border}40`, background: "#0d0d1a" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
                <span style={{ fontSize: "13px", color: "#888" }}>No.{selectedEl.no}</span>
                <span style={{ fontSize: "42px", fontWeight: "bold", lineHeight: 1, color: "white" }}>{selectedEl.symbol}</span>
                <span style={{ fontSize: "22px", fontWeight: "bold", color: "#e0e0ff" }}>{selectedEl.name}</span>
                <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "4px", background: `${CATEGORY_COLORS[getCategory(selectedEl.no)].bg}`, border: `1px solid ${CATEGORY_COLORS[getCategory(selectedEl.no)].border}`, color: CATEGORY_COLORS[getCategory(selectedEl.no)].border, fontWeight: "bold" }}>
                  {CATEGORY_COLORS[getCategory(selectedEl.no)].label}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button onClick={() => toggleFavorite(selectedEl.no)} style={{ padding: "8px 14px", fontSize: "18px", borderRadius: "8px", border: `1px solid ${favorites.includes(selectedEl.no) ? "#ffd700" : "#333"}`, background: favorites.includes(selectedEl.no) ? "#ffd70022" : "transparent", color: "#ffd700", cursor: "pointer" }}>
                  {favorites.includes(selectedEl.no) ? "★" : "☆"}
                </button>
                <button onClick={() => setSelectedEl(null)} style={{ padding: "8px 14px", fontSize: "18px", borderRadius: "8px", border: "none", background: "transparent", color: "#888", cursor: "pointer", fontWeight: "bold" }}>✕</button>
              </div>
            </div>

            {/* ボディ：横2カラム */}
            <div style={{ display: "flex", gap: 0 }}>
              
              {/* 左カラム：電子配置図 */}
              <div style={{ width: "200px", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px", borderRight: "1px solid #2d2d4d", background: "#0d0d1a" }}>
                <ElectronDiagram electrons={selectedEl.electrons} />
                <p style={{ fontSize: "11px", color: "#555", margin: "8px 0 4px 0", textAlign: "center" }}>電子配置</p>
                <p style={{ fontSize: "12px", color: "#00e5a0", fontFamily: "monospace", textAlign: "center", margin: 0, letterSpacing: "1px" }}>
                  {selectedEl.electrons.join(" - ")}
                </p>
                <div style={{ marginTop: "14px", width: "100%" }}>
                  {[
                    { label: "原子番号", val: selectedEl.no },
                    { label: "元素記号", val: selectedEl.symbol },
                    { label: "電子殻数", val: selectedEl.electrons.length },
                    { label: "最外殻電子", val: selectedEl.electrons[selectedEl.electrons.length - 1] },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", padding: "4px 0", borderBottom: "1px solid #1d1d2d" }}>
                      <span style={{ color: "#666" }}>{label}</span>
                      <span style={{ color: "#ccc", fontWeight: "bold" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 右カラム：解説 */}
              <div style={{ flex: 1, padding: "20px 22px", overflowY: "auto", maxHeight: "70vh" }}>
                <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#d0d0e8", margin: "0 0 18px 0" }}>
                  {selectedEl.info.split("主要な物質の例：")[0]}
                </p>

                {selectedEl.info.includes("主要な物質の例：") && (
                  <div>
                    <p style={{ fontSize: "12px", color: "#ffaa00", fontWeight: "bold", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "1px" }}>💡 主要な物質の例</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {selectedEl.info.split("主要な物質の例：")[1].split("、").filter(Boolean).map((item, i) => (
                        <div key={i} style={{ background: "#0d0d1a", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: "#b0b0cc", border: "1px solid #2d2d4d", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ color: CATEGORY_COLORS[getCategory(selectedEl.no)].border, fontSize: "10px" }}>▶</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                  <button onClick={() => { setSelectedEl(null); setAppMode("QUIZ"); setStartNo(selectedEl.no); setEndNo(selectedEl.no); }}
                    style={{ padding: "10px 20px", fontSize: "13px", borderRadius: "8px", border: "none", background: "#5555ff", color: "white", cursor: "pointer", fontWeight: "bold" }}>
                    この元素をクイズ
                  </button>
                  <button onClick={() => setSelectedEl(null)} style={{ padding: "10px 20px", fontSize: "13px", borderRadius: "8px", border: "1px solid #333", background: "transparent", color: "#aaa", cursor: "pointer" }}>閉じる</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
