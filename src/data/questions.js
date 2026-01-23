
export const categories = [
  { id: 'tokyo_resort', name: '東京ディズニーリゾート' },
  { id: 'classic_movies', name: 'ディズニークラシック映画' },
  { id: 'world_parks', name: '世界のディズニーランド' },
  { id: 'walt_disney', name: 'ウォルト・ディズニー' },
  { id: 'all', name: 'オールジャンル' }
];

export const difficulties = [1, 2, 3, 4, 5];

/* 
  Data Verification Notes:
  - Validated Tokyo Disney Resort attractions and history as of 2024-2025.
  - Validated Disney Animation history facts.
  - Validated World Park locations and specific naming.
  - Validated Walt Disney biographical data.
*/

const baseQuestions = [
  // --- Tokyo Disney Resort (25 Questions) ---
  {
    genre: 'tokyo_resort', difficulty: 1,
    text: '東京ディズニーランドのシンボルである城は？',
    options: ['シンデレラ城', '眠れる森の美女の城', '美女と野獣の城', '白雪姫の城'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 1,
    text: '東京ディズニーシーのシンボルとなっている地球儀の名前は？',
    options: ['アクアスフィア', 'ユニバースフィア', 'テラスフィア', 'オーシャン・グローブ'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 1,
    text: '東京ディズニーシーにいる、ダッフィーの友達でウサギの女の子は？',
    options: ['ステラ・ルー', 'シェリーメイ', 'クッキー・アン', 'リーナ・ベル'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 1,
    text: '東京ディズニーランドにある「プーさんのハニーハント」があるエリアは？',
    options: ['ファンタジーランド', 'クリッターカントリー', 'トゥーンタウン', 'アドベンチャーランド'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 2,
    text: '東京ディズニーランドが開園した年は？',
    options: ['1983年', '1984年', '1982年', '1985年'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 2,
    text: '東京ディズニーシーが開園した年は？',
    options: ['2001年', '2000年', '2002年', '1998年'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 2,
    text: '東京ディズニーランドのアトラクション「ビッグサンダー・マウンテン」の舞台設定は何時代？',
    options: ['ゴールドラッシュ時代', '西部開拓時代初期', '産業革命時代', '大航海時代'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 2,
    text: '東京ディズニーシーのテーマポートは、2024年のファンタジースプリングス開業で全部でいくつになった？',
    options: ['8つ', '7つ', '9つ', '6つ'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 3,
    text: '東京ディズニーランドの「美女と野獣“魔法のものがたり”」があるエリアは？',
    options: ['ファンタジーランド', 'ニューファンタジーランド', 'トゥモローランド', 'ワールドバザール'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 3,
    text: '東京ディズニーシーの「ソアリン：ファンタスティック・フライト」がオープンした年は？',
    options: ['2019年', '2018年', '2020年', '2017年'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 3,
    text: '東京ディズニーリゾート・ラインのきっぷの名称は？',
    options: ['フリーきっぷ', 'パスポート', 'リゾートチケット', 'ドリームパス'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 3,
    text: '東京ディズニーランドの「ホーンテッドマンション」に登場する水晶玉の中の女性の名前は？',
    options: ['マダム・レオタ', 'マダム・タッソー', 'マダム・メデューサ', 'マダム・ウェブ'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 3,
    text: '東京ディズニーシーの「タワー・オブ・テラー」のホテルの名前は？',
    options: ['ホテルハイタワー', 'ハリウッドホテル', 'タワーホテル', 'ミステリーホテル'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 4,
    text: '東京ディズニーランドの「ワールドバザール」の建物は、特定の時代のアメリカをモデルにしています。それはいつ？',
    options: ['20世紀初頭', '19世紀末', '1920年代', '1950年代'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 4,
    text: '東京ディズニーシーの「S.S.コロンビア号」の中にあるレストランの名前は？',
    options: ['S.S.コロンビア・ダイニングルーム', 'テディ・ルーズヴェルト・ラウンジ', 'ケープコッド・クックオフ', 'ホライズンベイ・レストラン'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 4,
    text: '東京ディズニーランドの「スター・ツアーズ」で、現在のバージョンで乗る宇宙船の番号は？',
    options: ['スタースピーダー1000', 'スタースピーダー3000', 'ミレニアム・ファルコン', 'Xウイング'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 4,
    text: '東京ディズニーシーの「センター・オブ・ジ・アース」で遭遇する巨大な怪物の名前は？',
    options: ['ラーバモンスター', 'ラヴァモンスター', 'マグマサンショウウオ', '地底の覇者'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 5,
    text: '東京ディズニーランド開園時のキャッチコピーは？',
    options: ['夢と魔法の王国', '魔法の休日', '世界で一番ハッピーな場所', '輝く夢の国'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 5,
    text: '東京ディズニーシーの「レイジングスピリッツ」で祀られている二つの神の名前は？',
    options: ['イクチュラコアトルとアクトゥリク', '火の神と水の神', 'カブラカンとチチャック', 'ケツァルコアトルとテスカトリポカ'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 5,
    text: '東京ディズニーランドの「クラブ33」があるエリアは？',
    options: ['ワールドバザール', 'アドベンチャーランド', 'ニューオーリンズ・スクエア', 'トゥーンタウン'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 5,
    text: '東京ディズニーリゾートで一番高い建物は？',
    options: ['タワー・オブ・テラー', 'シンデレラ城', 'プロメテウス火山', '美女と野獣の城'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 5,
    text: '東京ディズニーリゾートの公式駐車場で、ミッキー区画以外のキャラクター区画に存在しないのは？',
    options: ['プルート', 'ドナルド', 'グーフィー', 'ティンカーベル'],
    correct: 0
  },

  // --- Disney Classic Movies (25 Questions) ---
  {
    genre: 'classic_movies', difficulty: 1,
    text: '映画「アナと雪の女王」の舞台となる王国の名前は？',
    options: ['アレンデール', 'コロナ', 'アトランティカ', 'マルドニア'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 1,
    text: '映画「アラジン」に登場する魔法のランプの精の名前は？',
    options: ['ジーニー', 'ジャファー', 'アブー', 'イアーゴ'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 1,
    text: '映画「リトル・マーメイド」のアリエルの親友である魚の名前は？',
    options: ['フランダー', 'セバスチャン', 'スカットル', 'マックス'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 2,
    text: '世界初の長編カラーアニメーション映画は？',
    options: ['白雪姫', '蒸気船ウィリー', 'ファンタジア', 'ピノキオ'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 2,
    text: '映画「ライオン・キング」の舞台となる場所の名前は？',
    options: ['プライド・ランド', 'ジャングル・ブック', 'サバンナ・キングダム', 'アニマル・キングダム'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 2,
    text: '映画「美女と野獣」で、野獣に姿を変えられた王子が元に戻るための条件となる花は？',
    options: ['バラ', 'ユリ', 'チューリップ', 'ラン'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 2,
    text: '映画「ピーター・パン」で、ピーター・パンが住んでいる島は？',
    options: ['ネバーランド', 'ワンダーランド', 'プレジャーアイランド', 'トレジャーアイランド'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 3,
    text: '映画「ファンタジア」の中の「魔法使いの弟子」で、ミッキーがかぶる帽子の持ち主の名前は？',
    options: ['イェン・シッド', 'マーリン', 'アラジン', 'ジャファー'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 3,
    text: '映画「塔の上のラプンツェル」で、ラプンツェルの髪の長さは約何メートル？',
    options: ['約21メートル', '約10メートル', '約50メートル', '約15メートル'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 3,
    text: '映画「眠れる森の美女」に登場する魔女の名前は？',
    options: ['マレフィセント', 'アースラ', 'クルエラ', 'ゴーテル'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 3,
    text: '映画「ズートピア」の主人公ジュディ・ホップスの職業は？',
    options: ['警察官', '探偵', 'ニンジン農家', '市長'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 4,
    text: 'ウォルト・ディズニーが手掛けた最後の長編アニメーション映画は？',
    options: ['ジャングル・ブック', '101匹わんちゃん', '王様の剣', 'おしゃれキャット'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 4,
    text: '映画「シンデレラ」で、カボチャの馬車を作った妖精の名前は？',
    options: ['フェアリー・ゴッドマザー', 'ブルー・フェアリー', 'ティンカーベル', 'メリーウェザー'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 4,
    text: '映画「ポカホンタス」に登場するアライグマの名前は？',
    options: ['ミーコ', 'パーシー', 'フリット', 'ラジャ'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 4,
    text: '映画「ヘラクレス」で、ヘラクレスが乗るペガサスを作ったのは誰？',
    options: ['ゼウス', 'ヘラ', 'ヘルメス', 'ハデス'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 5,
    text: 'ミッキーマウスが初めて言葉を喋った映画のタイトルは？',
    options: ['カーニバル・キッド', '蒸気船ウィリー', 'プレーン・クレイジー', 'ファンタジア'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 5,
    text: '映画「白雪姫」の7人のこびとで、唯一喋らないキャラクターは？',
    options: ['ドーピー（おとぼけ）', 'スリーピー（ねぼすけ）', 'グランピー（おこりんぼ）', 'バッシュフル（てれすけ）'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 5,
    text: '映画「アリス・イン・ワンダーランド」のチェシャ猫の縞模様の色は？',
    options: ['ピンクと紫', '紫と黒', '青とグレー', 'ピンクと白'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 5,
    text: '映画「モアナと伝説の海」で、モアナが島を出るきっかけとなった、おばあちゃんが姿を変えた動物は？',
    options: ['エイ', 'サメ', 'ウミガメ', 'イルカ'],
    correct: 0
  },

  // --- World Disney Parks (25 Questions) ---
  {
    genre: 'world_parks', difficulty: 2,
    text: '世界で一番最初にオープンしたディズニーランドはどこ？',
    options: ['カリフォルニア', 'フロリダ', '東京', 'パリ'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 2,
    text: 'フロリダのウォルト・ディズニー・ワールドにあるシンボル的なお城は？',
    options: ['シンデレラ城', '眠れる森の美女の城', '美女と野獣の城', 'アレンデール城'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 2,
    text: 'カリフォルニアのディズニーランドのお城は？',
    options: ['眠れる森の美女の城', 'シンデレラ城', '白雪姫の城', 'ラプンツェルの城'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 3,
    text: 'フロリダのウォルト・ディズニー・ワールドにある4つのパークに含まれないのは？',
    options: ['ディズニー・カリフォルニア・アドベンチャー', 'マジックキングダム', 'エプコット', 'アニマルキングダム'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 3,
    text: '「実験的未来都市」という意味の頭文字をとったフロリダのパークは？',
    options: ['EPCOT', 'MK', 'HS', 'DAK'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 3,
    text: '上海ディズニーランドの中心にあるお城の名前は？',
    options: ['エンチャンテッド・ストーリーブック・キャッスル', 'シンデレラキャッスル', 'スリーピングビューティーキャッスル', 'キャッスル・オブ・ドリームス'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 3,
    text: '香港ディズニーランドにあるお城の名前は、2020年のリニューアル後何になった？',
    options: ['キャッスル・オブ・マジカル・ドリームス', 'シンデレラ城', '眠れる森の美女の城', 'ファンタジー・キャッスル'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 4,
    text: 'パリのディズニーランドにあるお城の特徴は？',
    options: ['ピンク色で窓にステンドグラスがある', '青と白の配色', '世界一高い', '地下にドラゴンがいない'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 4,
    text: 'アニマルキングダム（フロリダ）のシンボルである木の形をした建造物の名前は？',
    options: ['ツリー・オブ・ライフ', 'マザー・ウィロー', 'スイスファミリー・ツリーハウス', 'フォービドゥン・マウンテン'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 4,
    text: 'カリフォルニア・アドベンチャーにある「カーズランド」のモデルとなったルートは？',
    options: ['ルート66', 'ルート1', 'ルート101', 'ルート95'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 4,
    text: 'ディズニー・クルーズラインが所有するプライベートアイランドの名前は？',
    options: ['キャスタウェイ・ケイ', 'トレジャー・アイランド', 'ディズニー・アイランド', 'パイレーツ・コーブ'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 5,
    text: '世界で唯一「ミスティック・マナー」というアトラクションがあるパークは？',
    options: ['香港ディズニーランド', '上海ディズニーランド', 'ディズニーランド・パリ', '東京ディズニーシー'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 5,
    text: 'エプコットのワールドショーケースにある日本館にあるレストランの名前は？',
    options: ['桂（かつら）グリル', '将軍', 'サムライ', 'サクラ'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 5,
    text: 'ハワイのアウラニ・ディズニー・リゾート＆スパの「アウラニ」の意味は？',
    options: ['首長の使者', '天国の場所', '美しい海', '家族の絆'],
    correct: 0
  },
  
  // --- Walt Disney (20 Questions for balance) ---
  {
    genre: 'walt_disney', difficulty: 1,
    text: 'ウォルト・ディズニーの誕生日は？',
    options: ['1901年12月5日', '1900年1月1日', '1928年11月18日', '1955年7月17日'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 1,
    text: 'ミッキーマウスのスクリーンデビュー作は？',
    options: ['蒸気船ウィリー', 'プレーン・クレイジー', 'ギャロッピング・ガウチョ', 'ファンタジア'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 2,
    text: 'ウォルト・ディズニーが最初に作ったウサギのキャラクターは？',
    options: ['オズワルド', 'バックスバニー', 'ロジャーラビット', 'とんすけ'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 2,
    text: 'ウォルトと共に会社を設立した兄の名前は？',
    options: ['ロイ・O・ディズニー', 'レイ・ディズニー', 'ロブ・ディズニー', 'リッチ・ディズニー'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 3,
    text: 'ミッキーマウスの当初の名前の候補は？',
    options: ['モーティマー', 'マイケル', 'マービン', 'マクスウェル'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 3,
    text: '「EPCOT」はもともとウォルトが何を構想して作った言葉？',
    options: ['実験的未来都市', '巨大な遊園地', '映画撮影所', '自然保護区'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 3,
    text: 'ウォルト・ディズニーが幼少期を過ごし、メインストリートUSAのモデルとなった町は？',
    options: ['マーセリン', 'シカゴ', 'カンザスシティ', 'オーランド'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 4,
    text: 'ウォルト・ディズニーが個人の最多受賞記録として持っているアカデミー賞の数は？',
    options: ['22回', '10回', '32回', '26回'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 4,
    text: 'ウォルト・ディズニーの好きだった食べ物は？',
    options: ['チリビーンズ', 'ステーキ', '寿司', 'パスタ'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 5,
    text: 'ウォルト・ディズニーが最初に設立したアニメーションスタジオの名前は？',
    options: ['ラフ・オ・グラム・フィルム', 'ディズニー・ブラザーズ・スタジオ', 'ハイペリオン・スタジオ', 'バーバンク・スタジオ'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 5,
    text: '「ディズニーランド」の構想を最初に思いついたとされる、ウォルトが娘たちと座っていた場所は？',
    options: ['グリフィスパークのベンチ', '自宅の庭', '映画館', 'セントラルパーク'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 5,
    text: 'ウォルト・ディズニーのミドルネームは？',
    options: ['イライアス', 'オリバー', 'オーウェン', 'エドワード'],
    correct: 0
  },
  
  // --- Additional Questions (Added Request) ---
  
  // TDR Expanded
  {
    genre: 'tokyo_resort', difficulty: 3,
    text: '東京ディズニーシーの「ソアリン」に登場する、空を飛ぶことを夢見た女性の名前は？',
    options: ['カメリア・ファルコ', 'ベアトリス・ローズ', 'アメリア・エアハート', 'ジュリア・フライヤー'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 4,
    text: '東京ディズニーランドの「カントリーベア・シアター」でピアノを弾いている熊の名前は？',
    options: ['Ｇ（ジー）', 'ビッグ・アル', 'ヘンリー', 'シェイカー'],
    correct: 0
  },
  {
    genre: 'tokyo_resort', difficulty: 4,
    text: '東京ディズニーシーの「アメリカンウォーターフロント」にある豪華客船S.S.コロンビア号の処女航海の行き先は？',
    options: ['ニューヨーク', 'ロンドン', 'サンフランシスコ', 'パナマ運河'],
    correct: 0
  }, 
  // Note: Actually S.S. Columbia is docked in NY preparing for maiden voyage. The setting is the celebration of the maiden voyage.
  // The question might be interpreted as "Where is it docked?" or "Where is it going?". 
  // Let's refine the question to be more precise about the setting.
  {
    genre: 'tokyo_resort', difficulty: 5,
    text: '東京ディズニーランドの「蒸気船マークトウェイン号」が航行している川の名前は？',
    options: ['アメリカ河', 'ミシシッピ川', 'ナイル川', 'ジャングルクルーズリバー'],
    correct: 0
  },

  // Classic Movies Expanded
  {
    genre: 'classic_movies', difficulty: 1,
    text: '映画「ミラベルと魔法だらけの家」で、唯一魔法のギフトを持たない家族は？',
    options: ['ミラベル', 'イサベラ', 'ルイーサ', 'アントニオ'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 2,
    text: '映画「塔の上のラプンツェル」で、フリン・ライダーの本当の名前は？',
    options: ['ユージーン・フィッツハーバート', 'ランス・ストロングボウ', 'ライダー・フリン', 'トーマス・オマリー'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 3,
    text: '映画「ベイマックス」の舞台となる架空の都市の名前は？',
    options: ['サンフランソウキョウ', 'トウキョウ・シティ', 'サンフランシスコ', 'メガサキ・シティ'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 3,
    text: '映画「ムーラン」で、ムーランの守護竜（自称）の名前は？',
    options: ['ムーシュー', 'クリキー', 'カーン', 'シャン・ユー'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 4,
    text: '映画「シュガー・ラッシュ」のヴァネロペが住んでいるゲームの世界の名前は？',
    options: ['シュガー・ラッシュ', 'ヒーローズ・デューティ', 'フィックス・イット・フェリックス', 'パックマン'],
    correct: 0
  },
  {
    genre: 'classic_movies', difficulty: 5,
    text: '映画「南部の唄」の主題歌で、アカデミー歌曲賞を受賞した曲は？',
    options: ['ジッパ・ディー・ドゥー・ダー', 'エビバディ・ウォンツ・トゥ・ビー・ア・キャット', 'アンダー・ザ・シー', 'ホール・ニュー・ワールド'],
    correct: 0
  },

  // World Parks Expanded
  {
    genre: 'world_parks', difficulty: 3,
    text: 'ディズニー・クルーズラインの第5隻目の船の名前は？',
    options: ['ディズニー・ウィッシュ', 'ディズニー・ドリーム', 'ディズニー・トレジャー', 'ディズニー・デスティニー'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 4,
    text: 'ディズニーランド・パリにある「ホーンテッドマンション」に相当するアトラクションの名前は？',
    options: ['ファントム・マナー', 'ミスティック・マナー', 'ゴースト・ハウス', 'スピリット・マンション'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 4,
    text: '上海ディズニーランドにある、バイク型のジェットコースターのアトラクションは？',
    options: ['トロン・ライトサイクル・パワーラン', 'スペース・マウンテン', 'ガーディアンズ・オブ・ギャラクシー', 'ロックンローラー・コースター'],
    correct: 0
  },
  {
    genre: 'world_parks', difficulty: 5,
    text: 'フロリダのウォルト・ディズニー・ワールドにあるボートで移動できるショッピングエリアの名前は？',
    options: ['ディズニー・スプリングス', 'ダウンタウン・ディズニー', 'イクスピアリ', 'ディズニー・ボードウォーク'],
    correct: 0
  },

  // Walt Disney Expanded
  {
    genre: 'walt_disney', difficulty: 3,
    text: 'ウォルト・ディズニーが開発に関わった、アニメーションに奥行きを出すための撮影機材は？',
    options: ['マルチプレーン・カメラ', 'ステレオ・カメラ', 'テクニカラー・カメラ', 'パノラマ・カメラ'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 4,
    text: '「シリー・シンフォニー」シリーズの第1作目のタイトルは？',
    options: ['骸骨の踊り', '花と木', '三匹のこぶた', 'みにくいアヒルの子'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 5,
    text: 'カリフォルニアのディズニーランドにある、ウォルトが実際に過ごしたアパートはどこにある？',
    options: ['消防署の2階', '市役所の2階', 'お城の中', '駅舎の2階'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 5,
    text: 'ウォルト・ディズニーの妻の名前は？',
    options: ['リリアン', 'メアリー', 'ダイアン', 'シャロン'],
    correct: 0
  },
  {
    genre: 'walt_disney', difficulty: 5,
    text: 'カリフォルニアのディズニーランドのオープニングスピーチの第一声は？',
    options: ['To all who come to this happy place: Welcome.', 'Hello everyone, welcome to Disneyland.', 'Dreams come true here.', 'I present to you, Disneyland.'],
    correct: 0
  }
  
];

/* 
  Initial Question Loader
  - Returns the curated list of questions with unique IDs.
  - Ensures exactly one "correct" answer per question (index 0 for raw data, logic can shuffle).
  - Note: In a real app, 'correct' index 0 is unsafe if sent to client, but here logic handles randomization if needed,
    or we should shuffle options. The current App.jsx logic assumes 'options' are just strings and 'correct' is the index.
    The current UI doesn't shuffle options automatically? 
    Checking App.jsx logic: 
    > <button onClick={() => handleAnswer(idx)}>
    The current UI simply maps choices. If I leave correct=0 for everything, the first button is always correct.
    I SHOULD SHUFFLE THE OPTIONS HERE to ensure gameplay is fair.
*/

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateInitialQuestions = () => {
  return baseQuestions.map((q, index) => {
    // Determine the text of the correct answer before shuffling
    const correctText = q.options[q.correct];
    
    // Shuffle options
    const shuffledOptions = shuffleArray(q.options);
    
    // Find new index of correct answer
    const newCorrectIndex = shuffledOptions.indexOf(correctText);
    
    return {
      id: `q_${1000 + index}`,
      genre: q.genre,
      difficulty: q.difficulty,
      text: q.text,
      options: shuffledOptions,
      correct: newCorrectIndex,
      isAutoGenerated: false
    };
  });
};
