
/* --------------------------------------------------
script.js
サイト全体で読み込まれるJS
-------------------------------------------------- */

// jquery 競合対策
const jQueryLatest = jQuery.noConflict(true);
(function($) {

  /////////////////////////////////////////////////////////
  // 定数
  /////////////////////////////////////////////////////////

  // スクロール処理の実行タイミング（ms）
  const SCROLL_THRESHOLD = 10;

  // リサイズ処理の実行タイミング（ms）
  const RESIZE_THRESHOLD = 300;

  /////////////////////////////////////////////////////////
  // 変数
  /////////////////////////////////////////////////////////

  // サンプル変数
  let isData = 0;

  /////////////////////////////////////////////////////////
  // EVENT HOOK
  /////////////////////////////////////////////////////////

  /**
  * コンストラクタ
  * 
  * @return {boolean} false
  */
  const init = function(){
    isData = 1;
  };

  /**
  * コンテンツロードイベント
  * 画像、動画などの関連データの全ての読み込み後、実行する処理はここに記述する
  * 
  * @return {boolean} false
  */
  const contentLoaded = function(){
    $(window).on('load', function(){
      initSuruSuruScroll();
      initAcc();
      initAccSp();
      initCustomSelector();
      initCaseStudy();
      initMenuBtn();
      initCase();
      initEstimateForm();
      initMypage();
    });
  }

  /**
  * スクロールイベント
  * スクロールを監視して呼び出す処理はここに記述する
  * 
  * @return {boolean} false
  */
  const watchScroll = function(){
    let timerId = null;
    $(window).on('load scroll', function(){
      // 間引き処理
      clearTimeout(timerId); 
      timerId = setTimeout(function(){

        // ここに処理を記述

        // トップへ戻るボタン表示/非表示
        toggleTotop();

        // ヘッダ固定化処理
        headerFix();

      }, SCROLL_THRESHOLD);
    });
  }

  /**
  * リサイズイベント
  * リサイズを監視して呼び出す処理はここに記述する
  * 
  * @return {boolean} false
  */
  const watchResize = function(){
    let timerId = null;
    $(window).on('load resize', function(){
      // 間引き処理
      clearTimeout(timerId); 
      timerId = setTimeout(function(){

        // ここに処理を記述

        // バリデーションエラーをいったん削除
        $('.-hasFormError').removeClass('-hasFormError');

        // 高さ調整
        adjustMinHeight();
        adjustMinHeight2();

      }, RESIZE_THRESHOLD);
    });
  }

  // 初期化
  init();

  // コンテンツロードイベントをセット
  contentLoaded();

  // スクロールイベントをセット
  watchScroll();

  // リサイズイベントをセット
  watchResize();


  /////////////////////////////////////////////////////////
  // FUNCTION
  /////////////////////////////////////////////////////////

  /**
  * トップへ戻るボタン表示/非表示
  * 現在のスクロール量が、一定以上だったら、トップへ戻るボタンを表示/非表示する
  * スクロールイベントで呼び出し
  * 
  * @return {boolean} false
  */
  const toggleTotop = function(){

    // 発火するスクロール量
    const startPos = 100;

    if( $(window).scrollTop() > startPos ){
      $('body').attr('data-showTotopBtn','true');
    }else{
      $('body').attr('data-showTotopBtn','false');
    }
  };

  /**
  * するするスクロール初期化
  * すべてのページ内アンカーリンクを、するするスクロールにする
  * 
  * @return {boolean} false
  */
  const initSuruSuruScroll = function(){

    // href="#xxx"を押したときの処理実装
    $('a[href^="#"]').on('click', function(){
      const margin = 20;
      const speed = 500;
      const href= $(this).attr("href");
      const target = $(href == "#" ? 'html' : href);
      const position = target.offset().top;
      $("html, body").animate({scrollTop:position-margin}, speed, "swing");
      return false;
    });
  }

  /**
  * アコーディオン
  * data-js="acc"の要素にアコーディオン処理を実装する。
  * 
  * @return {boolean} false
  */
  const initAcc = function(){

    // [data-js="acc"]がなければ何もしない
    if( !$('[data-js="acc"]').length ){
      return false;
    }

    // 初期状態が非表示のとき、コンテンツを隠す
    $('[data-js="acc"][data-acc-state="close"] [data-acc-roll="content"]').hide();

    // トリガーをクリックで、data-acc-stateを変更する。
    $('[data-js="acc"] [data-acc-roll="trigger"]').on('click',function(){

      // 親要素とコンテンツ要素の取得
      const $parent = $(this).closest('[data-js="acc"]');
      const $content = $parent.find('[data-acc-roll="content"]').eq(0);

      // 状態による分岐      
      if( $parent.attr('data-acc-state') === 'opening' || $parent.attr('data-acc-state') === 'closing' ){

        // アニメーション中だったら、なにもしない
        return false;

      }else if( $parent.attr('data-acc-state') === 'close' ){

        // close -> open
        $parent.attr('data-acc-state', 'opening');
        $content.slideDown(300, function(){
          $parent.attr('data-acc-state', 'open');
        });

      }else{

        // open -> close
        $parent.attr('data-acc-state', 'closing');
        $content.slideUp(300, function(){
          $parent.attr('data-acc-state', 'close');
        });
      }
    });
  }
  /**
  * SP専用アコーディオン
  * data-js="accSp"の要素にアコーディオン処理を実装する。
  * 
  * @return {boolean} false
  */
   const initAccSp = function(){

    // [data-js="accSp"]がなければ何もしない
    if( !$('[data-js="accSp"]').length ){
      return false;
    }

    // 初期状態が非表示かつSP幅のとき、コンテンツを隠す
    if( $(window).width() <= 768 ){
      $('[data-js="accSp"][data-accSp-state="close"] [data-accSp-roll="content"]').hide();
    }

    // トリガーをクリックで、data-accSp-stateを変更する。
    $('[data-js="accSp"] [data-accSp-roll="trigger"]').on('click',function(){

      // PC幅だったらなにもしない
      if( $(window).width() > 768 ){
        return false;
      }

      // 親要素とコンテンツ要素の取得
      const $parent = $(this).closest('[data-js="accSp"]');
      const $content = $parent.find('[data-accSp-roll="content"]').eq(0);

      // 状態による分岐      
      if( $parent.attr('data-accSp-state') === 'opening' || $parent.attr('data-accSp-state') === 'closing' ){

        // アニメーション中だったら、なにもしない
        return false;

      }else if( $parent.attr('data-accSp-state') === 'close' ){

        // close -> open
        $parent.attr('data-accSp-state', 'opening');
        $content.slideDown(300, function(){
          $parent.attr('data-accSp-state', 'open');
        });

      }else{

        // open -> close
        $parent.attr('data-accSp-state', 'closing');
        $content.slideUp(300, function(){
          $parent.attr('data-accSp-state', 'close');
        });
      }
    });

    // ウィンドウサイズがPCになったとき、無条件でopenにする
    $(window).on('resize',function(){
      if( $(window).width() <= 768 ){
        // 親要素とコンテンツ要素の取得
        $('[data-js="accSp"]').attr('data-accSp-state', 'open');;
        $('[data-accSp-roll="content"]').slideDown(0);
      }
    });
  }
  /**
  * カスタムセレクタ（.form-customSelector）の初期化処理
  * data-js="acc"の要素にアコーディオン処理を実装する。
  * 
  * @return {boolean} false
  */
   const initCustomSelector = function(){

    $('.form-customSelector').each(function(){

      let $trigger = $(this).find('[data-acc-roll="trigger"]');

      // 選択肢を選択したとき
      $(this).find('label').on('click',function(){

        // トリガーの文字を変更する。
        $trigger.html( $(this).html().replace(/<span.*span>/,'') );

        // メニューを閉じる
        $trigger.click();
      });

      // 選択肢の前に色のスタイルを設定する
      $(this).find('label > span').each(function(){
        let color = $(this).attr('data-color');
        if( color != '' ){
          $(this).css({
            'background-color': color,
            'border-color': color
          });
        }
      });
    });
  }
  /**
  * トップ Case Studyのスライダー初期化
  * data-js="sliderCaseStudy"の要素にスライダーの初期化を行う
  * 
  * @return {boolean} false
  */
  const initCaseStudy = function(){

    // [data-js="sliderCaseStudy"]がなければ何もしない
    if( !$('[data-js="sliderCaseStudy"]').length ){
      return false;
    }

    // 初期化
    $('[data-js="sliderCaseStudy"] ul').slick({
      centerMode: true,
      arrow: false,
      centerPadding: '8%',
      slidesToShow: 5,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '12%',
            slidesToShow: 2
          }
        }
      ]
    });
  }

  /**
  * ラインアップ Caseのスライダー初期化
  * data-js="sliderCase"の要素にスライダーの初期化を行う
  * 
  * @return {boolean} false
  */
   const initCase = function(){

    // [data-js="sliderCase"]がなければ何もしない
    if( !$('[data-js="sliderCase"]').length ){
      return false;
    }

    // 初期化
    $('[data-js="sliderCase"] ul').slick({
      slidesToShow: 5,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3
          }
        }
      ]
    });
  }

  /**
  * min-height調整
  * data-js="adjustHeight"の下にある-data-js="adjustHeight_child"の最小高さを合わせる
  * ※PCサイズのときのみ。SPのときはリセットする。
  * 
  * @return {boolean} false
  */
  const adjustMinHeight = function(){
   
    // [data-js="adjustHeight"] [data-js="adjustHeight_child"]がなければ何もしない
    if( !$('[data-js="adjustHeight"] [data-js="adjustHeight_child"]').length ){
      return false;
    }

    // 幅がsp幅なら、リセットして終了
    if( $(window).width() <= 768 ){
      $('[data-js="adjustHeight"] [data-js="adjustHeight_child"]').removeAttr('style');
      return false;
    }

    // 処理
    $('[data-js="adjustHeight"]').each(function(){

      let min_h = 0;

      $(this).find('[data-js="adjustHeight_child"]').removeAttr('style');
      $(this).find('[data-js="adjustHeight_child"]').each(function(){
        if( $(this).height() > min_h ){
          min_h = $(this).height();
        }
      });
      $(this).find('[data-js="adjustHeight_child"]').css('min-height', min_h + 'px');
    });
  }

    /**
  * min-height調整（その２ - ラインアップページのPickup用）
  * data-js="adjustHeight"の下にある-data-js="adjustHeight_child"の最小高さを合わせる
  * ※PCサイズのときのみ。SPのときはリセットする。
  * 
  * @return {boolean} false
  */
  const adjustMinHeight2 = function(){
   
      // [data-js="adjustHeight2"] [data-js="adjustHeight2_child"]がなければ何もしない
      if( !$('[data-js="adjustHeight2"] [data-js="adjustHeight2_child"]').length ){
        return false;
      }
  
      // 幅に応じてカラム数を設定
      let column_cnt = 1;
      if( $(window).width() <= 768 ){ // sp
        column_cnt = 2;
      }else if( $(window).width() > 768 && $(window).width() <= 980 ){
        column_cnt = 3;
      }else{
        column_cnt = 4;
      }

      // if( $(window).width() <= 768 ){
      //   $('[data-js="adjustHeight"] [data-js="adjustHeight_child"]').removeAttr('style');
      //   return false;
      // }
  
      // 処理
      $('[data-js="adjustHeight2"]').each(function(){

        let cnt = $(this).find('[data-js="adjustHeight2_child"]').length;

        // 解除
        $(this).find('[data-js="adjustHeight2_child"]').removeAttr('style');

        // 段ごとのループ
        for( i=0; i<Math.ceil(cnt/column_cnt); i++){

          // maxの取得
          let min_h = 0;
          for( j=0; j<column_cnt; j++ ){
            if( $(this).find('[data-js="adjustHeight2_child"]').eq(i*column_cnt + j).height() > min_h ){
              min_h = $(this).find('[data-js="adjustHeight2_child"]').eq(i*column_cnt + j).height();
            }
          }
          for( j=0; j<column_cnt; j++ ){
            $(this).find('[data-js="adjustHeight2_child"]')
              .eq(i*column_cnt + j)
              .css('min-height', min_h + 'px');
          }
        }
      });
  }

  /**
  * トップページのヘッダ固定化処理
  * 
  * @return {boolean} false
  */
  const headerFix = function(){

    // トップページでなければ、なにもしない
    if( !$('body#page_top').length ){
      return false;
    }

    const headerHeight = 107;

    // .pageTop-caseStudyの上限の位置を取得する。

    if( $('.pageTop-caseStudy').offset().top - headerHeight < $(window).scrollTop() ){

      // 固定化する
      $('body').attr('data-fixHeader','true');

    }else{

      //固定化解除する。
      $('body').attr('data-fixHeader','false');

    }

  }

  /**
  * ヘッダメニューボタンのクリック処理
  * 
  * @return {boolean} false
  */
  const initMenuBtn = function(){

    $('.global-header .menu_sp .-menu a').click(function(e){

      e.preventDefault();
      e.stopPropagation();

      // ロック中はなにもしない
      if( $('body').hasClass('-stLock') ){
        return false;
      }

      // ロックする
      $('body').addClass('-stLock');

      // クローズだったら、開く
      if( $('body').attr('data-spMenu') === 'close' ){

        $('body').attr('data-spMenu', 'open');

      }else{

        $('body').attr('data-spMenu', 'close');
      }

      // ロック解除
      $('body').removeClass('-stLock');
    });

  }

  /**
  * 見積フォームの初期化
  * 
  * @return {boolean} false
  */
  const initEstimateForm = function(){

    // お見積りページ以外だったら、何もしない
    if(
      $('body').attr('id') != 'page_edit' &&
      $('body').attr('id') != 'page_estimateData'
    ){
      return false;
    }

    // ページタイプの取得
    // データ入稿：'data'
    // フォーム入稿：'form'
    let page_type = 'form';
    if( $('body').attr('id') == 'page_estimateData' ){
      page_type = 'data';
    }

    // （１）住所自動入力の処理実装
    $('[data-js="getAddressByZipcode"]').on('click',function(e){
      e.preventDefault();

      let zipcode1 = $('#customer_zipcode1').val();

      if(zipcode1 == ''){
        alert('郵便番号をご入力ください');
        return false;
      }

      // ajaxでのapi呼び出し
      $.ajax({	
        url:"https://zipcloud.ibsnet.co.jp/api/search",
        type:"GET",
        data:{
          zipcode: zipcode1,
          limit: 1,
        },
        dataType:"json",
        timespan:3000
      }).done(function(rawdata,textStatus,jqXHR) {

          // オブジェクトに変換
          var data1 = JSON.parse(JSON.stringify(rawdata));

          if(!data1.results){
            alert('住所が取得できませんでした。');
          }else{
            // フォームに入力
            $('#customer_prefecture1').val(data1.results[0].address1);
            $('#customer_address1').val(data1.results[0].address2);
            $('#customer_address2').val(data1.results[0].address3);
          }  
      }).fail(function(jqXHR, textStatus, errorThrown ) {
        alert('住所が取得できませんでした。');
      })
    });

    // （２）カラーシミュレーターモーダルの初期化（※フォーム入稿のみ）
    if(page_type == 'form'){
      (function(){

        // ・closeボタン
        $('[data-js="colorSimulator"] .btnClose1 > a').on('click',function(e){
          e.preventDefault();
          $('.pageEstimateForm-modalSimulator').removeClass('-show');
        })
        // ・文字
        $('[data-js="colorSimulator"] [name="simulator_bandText"]').on('change',function(){
          // エスケープ処理
          let escaped_text = $(this).val()
            .replace(/"/g,'&quot;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;');
          $('[data-js="colorSimulator"] .result > span').html( escaped_text );
        })
        // ・フォント
        $('[data-js="colorSimulator"] [name="simulator_font"]').on('change',function(){
          if( $(this).val() == '1' ){
            $('[data-js="colorSimulator"] .result > span').removeClass('-mincho').addClass('-gothic');
          }else{
            $('[data-js="colorSimulator"] .result > span').removeClass('-gothic').addClass('-mincho');
          }
        })
        // ・バンドカラー
        $('[data-js="colorSimulator"] [name="simulator_bandColor"]').on('change',function(){
          // 色コードの取得
          let color = $(this).next('label').find('span').attr('data-color');
          if( color == '' ){
            color = '#FFFFFF';
          }
          $('[data-js="colorSimulator"] .result').css( 'background-color', color );
        })
        // ・文字色
        $('[data-js="colorSimulator"] [name="simulator_textColor"]').on('change',function(){
          // 色コードの取得
          let color = $(this).next('label').find('span').attr('data-color');
          if( color == '' ){
            color = '#FFFFFF';
          }
          $('[data-js="colorSimulator"] .result > span').css( 'color', color );
        })
        // カラーシミュレーターモーダルを開くボタンの処理を実装
        $('[data-js="openColorSimulator"]').on('click',function(){

          $('.pageEstimateForm-modalSimulator').addClass('-show');

        });
      })();
    }

    // （３）文字入れ加工選択時の処理実装（※フォーム入稿のみ）
    if(page_type == 'form'){
      let txt_type1_changed = function(){
        // 選択された番号（1：なし、２：外側のみ、３：内側のみ、４：外側・内側）
        let selected = $(this).closest('li').find('input[type="radio"]').val();

        if(selected == '1'){
          $('.largeBlock1').hide();
          $('.largeBlock1 > .inner').hide();
        }else if(selected == '2'){
          $('.largeBlock1').show();
          $('.largeBlock1 > .inner:nth-of-type(1)').show();
          $('.largeBlock1 > .inner:nth-of-type(2)').hide();
        }else if(selected == '3'){
          $('.largeBlock1').show();
          $('.largeBlock1 > .inner:nth-of-type(1)').hide();
          $('.largeBlock1 > .inner:nth-of-type(2)').show();
        }else if(selected == '4'){
          $('.largeBlock1').show();
          $('.largeBlock1 > .inner').show();
        }
      }
      txt_type1_changed();
      $('.txt_type1 > li > label').on('click',txt_type1_changed);
    }

    // （４）外側文字入れ加工選択時の、文字色表示非表示処理（※フォーム入稿のみ）
    if(page_type == 'form'){
      let outer_textType1_changed = function(){

        // 選択された番号（1：凸加工、２：凹加工、３：凸加工+インク注入、４：プリント加工）
        let selected = $(this).closest('li').find('input[type="radio"]').val();
        if( selected == '3' || selected == '4'){
          $(this).closest('dd').next('dt').show().next('dd').show();
        }else if( selected == undefined ){
          $('.outer_textType1').closest('dd').next('dt').hide().next('dd').hide();
        }else{
          $(this).closest('dd').next('dt').hide().next('dd').hide();
        }
      }
      outer_textType1_changed();
      $('.outer_textType1 > li > label').on('click',outer_textType1_changed);
    }

    // （５）見積フォームのドラッグドロップ実装
    (function(){
      $('[data-js="uploadByDrop"]').each(function(){

        let $zone = $(this).find('[data-js="uploadByDrop_zone"]');
        let $input = $(this).find('[data-js="uploadByDrop_input"]');

        $zone.on("dragenter",function(e){
          e.preventDefault();
        });
        $zone.on("dragleave",function(e){
          e.preventDefault();
        });
        // ドラッグオーバー処理停止
        $zone.on("dragover",function(e){
          e.preventDefault();
        });
    
        // ドロップ処理
        $zone.on("drop",function(e){
          e.preventDefault();
    
          // ファイル取得
          let files = e.originalEvent.dataTransfer.files;

          // ファイルが複数のとき、エラーを返す
          if (files.length > 1){
            return alert('アップロードできるファイルは1つだけです。');
            $input.val('');
          }

          // inputのファイルを選択状態にする
          $input[0].files = files;

          // 選択されたファイル名を表示
          $input.closest('[data-js="uploadByDrop"]').find('.filename1').html( $input[0].files[0].name );

          // ファイル名を入力
          $('input[name="ext_col_15"]').val( $input[0].files[0].name );
        });

        // ファイルインプットが変わったときの処理
        $input.on("change",function(e){

          // 選択されたファイル名を表示
          $input.closest('[data-js="uploadByDrop"]').find('.filename1').html( $input[0].files[0].name );

          // ファイル名を入力
          $('input[name="ext_col_15"]').val( $input[0].files[0].name );
        })
      });
    })();

    // バリデーション01（Step1 -> Step2）
    const estimateFormValidation01 = function(){

      let errorFlag = false;
  
      // 汎用（PCとSPで分岐あり）
  
      // 汎用チェック対象（どの「文字入れ加工の選択」でも対象のもの）
      let general_target_selector =
        '.pageEstimateForm-form .groupSize1 [data-js="estimateForm_validationRequire"],' + 
        '.pageEstimateForm-form .groupColor1 [data-js="estimateForm_validationRequire"],' +
        '.pageEstimateForm-form .groupUpload [data-js="estimateForm_validationRequire"],' +
        '.pageEstimateForm-form .groupPeriod [data-js="estimateForm_validationRequire"]';
      // 文字入れ加工の選択により、対象を追加。
      if( $('.txt_type1 input[type="radio"]').length ){
        let type = $('.txt_type1 input[type="radio"]:checked').val();
        if(type==2){  // 外側のみ
          general_target_selector += ',.pageEstimateForm-form .groupTxt1 .largeBlock1 > .inner:nth-of-type(1) [data-js="estimateForm_validationRequire"]';
        }else if(type==3){   // 内側のみ
          general_target_selector += ',.pageEstimateForm-form .groupTxt1 .largeBlock1 > .inner:nth-of-type(2) [data-js="estimateForm_validationRequire"]';
        }else if(type==4){  // 外側・内側
          general_target_selector += ',.pageEstimateForm-form .groupTxt1 .largeBlock1 > .inner:nth-of-type(1) [data-js="estimateForm_validationRequire"]';
          general_target_selector += ',.pageEstimateForm-form .groupTxt1 .largeBlock1 > .inner:nth-of-type(2) [data-js="estimateForm_validationRequire"]';
        }
      }
      $(general_target_selector).each(function(){
        if(
          !($(window).width() <= 768 && $(this).hasClass('_pc')) &&
          !($(window).width() > 768 && $(this).hasClass('_sp'))
        ){
          if( $(this).val() === '' ){
            $(this).parent().addClass('-hasFormError');
            errorFlag = true;
          }
        }
      });
  
      // デザインデータアップロード（※データ入稿のみ）
      if(page_type == 'data'){
        if( $('[name="ext_col_15"]').val() == ''){
          $('[name="ext_col_15"]').closest('dd').addClass('-hasFormError');
          errorFlag = true;
        }
      }

      // サイズ・予定本数
      if(
        $('input[name="amount_kids"]').val() == '' &&
        $('input[name="amount_youth"]').val() == '' &&
        $('input[name="amount_adult"]').val() == '' &&
        $('input[name="amount_loose"]').val() == ''
      ){
        $('input[name="amount_kids"]').closest('.smallBlock1').closest('dd').addClass('-hasFormError');
        errorFlag = true;
      }

      // バンドカラー指定（SPのみ）
      if( $(window).width() <= 768 ){ // SP
        let $target1 = $('#band_color_radio_sp');
        let $target2 = $('[name="band_color_text_sp"]');
          if($target1.length && $target2.length){
            // セレクタが「選択してください」になっていて、かつ、その他テキストが空欄の場合にエラーを吐く
            if( $target1.html() == '選択してください' && $target2.val() == '' ){
              $target2.closest('dd').addClass('-hasFormError');
              errorFlag = true;
            }
          }
      }

      // 内外側の「文字入れ加工選択（外側）」「文字色（外側）」と「フォント指定（外側/内側）」（※フォーム入稿のみ）
      if(page_type == 'form'){
        if( $(window).width() > 768 ){  // PC

          let $target1, $target2;
          let type = $('.txt_type1 input[type="radio"]:checked').val();

          if(type==2 || type==4){ // 外側のみ or 外側・内側の場合 -> 外側をチェックする

            // 外側 - 文字入れ加工選択
            $target1 = $('[name="ext_col_06"]');
            $target2 = $('[name="ext_col_06"]:checked');
            if( !$target2.length ){  // なにもチェックされてないなら
              $target1.closest('dd').addClass('-hasFormError');
              errorFlag = true;
            }
            // 外側 - 文字色
            // 「外側」が選択されていて、さらに文字入れ加工選択が「インク注入」or「プリント加工」だったら、色指定を必須にする。
            let $type2 = $('.outer_textType1 input[type="radio"]:checked');
            if( $type2.length && ( $type2.val() == 3 || $type2.val() == 4 ) ){
              $target1 = $('[name="outer_color1"]');
              if( $target1.val() == '' ){
                $target1.closest('dd').addClass('-hasFormError');
                errorFlag = true;
              }
            }
            // 外側 - フォント指定
            $target1 = $('[name="outer_textFont"]:checked');
            $target2 = $('[name="outer_textFont_text"]');
            if(
              !$target1.length || // なにもチェックされてない or
              ($target1.val() == '11' && $target2.val() == '')  // 11番が選択されていて、テキストが未入力
            ){
              $target2.closest('dd').addClass('-hasFormError');
              errorFlag = true;
            }
          }else if(type==3 || type==4){ // 内側のみ or 外側・内側の場合 -> 内側をチェックする

            // 内側 - フォント指定
            $target1 = $('[name="inner_textFont"]:checked');
            $target2 = $('[name="inner_textFont_text"]');
            if(
              !$target1.length || // なにもチェックされてない or
              ($target1.val() == '11' && $target2.val() == '')  // 11番が選択されていて、テキストが未入力
            ){
              $target2.closest('dd').addClass('-hasFormError');
              errorFlag = true;
            }
          }

        }else{  // SP

          let type = $('.txt_type1 input[type="radio"]:checked').val();

          if(type==2 || type==4){ // 外側のみ or 外側・内側の場合 -> 外側をチェックする

            // 外側 - 文字入れ加工選択
            $target1 = $('[name="ext_col_06"]:checked');
            $target2 = $('[name="ext_col_06"]');
            if( !$target1.length ){  // なにもチェックされてないなら
              $target2.closest('dd').addClass('-hasFormError');
              errorFlag = true;
            }
            // 外側 - 文字色
            // 「外側」が選択されていて、さらに文字入れ加工選択が「インク注入」or「プリント加工」だったら、色指定を必須にする。
            let $type2 = $('.outer_textType1 input[type="radio"]:checked');
            if( $type2.length && ( $type2.val() == 3 || $type2.val() == 4 ) ){
              $target1 = $('#outer_color1_radio_sp');
              $target2 = $('input[name="outer_color1_text_sp"]');
              if(
                $target1.html() == '選択してください' && 
                $target2.val() == ''
              ){
                $target1.closest('dd').addClass('-hasFormError');
                errorFlag = true;
              }
            }

            // 外側 - フォント指定
            $target1 = $('#outer_textFont_radio_sp');
            $target2 = $('input[name="outer_textFont_text_sp"]');
            if(
              $target1.html() == '選択してください' && 
              $target2.val() == ''
            ){
              $target1.closest('dd').addClass('-hasFormError');
              errorFlag = true;
            }

          }else if(type==3 || type==4){ // 内側のみ or 外側・内側の場合 -> 内側をチェックする

            // 内側 - フォント指定
            $target1 = $('#inner_textFont_radio_sp');
            $target2 = $('input[name="inner_textFont_text_sp"]');
            if(
              $target1.html() == '選択してください' && 
              $target2.val() == ''
            ){
              $target1.closest('dd').addClass('-hasFormError');
              errorFlag = true;
            }
          }
        }
      }
  
      // 希望納期
      if( $('[name="date_year1"]').val() === '' || $('[name="date_month1"]').val() === '' || $('[name="date_day1"]').val() === '' ){
        $('[name="date_year1"]').closest('dd').addClass('-hasFormError');
        errorFlag = true;
      }
  
      if(errorFlag){
        return false;
      }else{
        return true;
      }
    }

    // 本当のフォームへの入力
    const estimateFormToRealForm = function(){

      // 「サイズ・予定本数」と「バンドの幅」
      let amount_kids = $('[name="amount_kids"]').val();
      let amount_youth = $('[name="amount_youth"]').val();
      let amount_adult = $('[name="amount_adult"]').val();
      let amount_loose = $('[name="amount_loose"]').val();
      let band_width = $('[name="band_width"]').val();
      $('[name="ext_col_01"]').val(`kids:${amount_kids},youth:${amount_youth},adult:${amount_adult},loose:${amount_loose},band_width:${band_width}`);

      // バンドカラー指定（PC/SP振り分けあり）
      if( $(window).width() > 768 ){
        $('[name="ext_col_03"]').val( $('[name="band_color"]').val() );
      }else{
        let $other = $('[name="band_color_text_sp"]');
        let $select = $other.closest('dd').find('.selectorHead1');
        if( $select.html() != '選択してください' ){
          $('[name="ext_col_03"]').val( $select.html() );
        }else{
          $('[name="ext_col_03"]').val( $other.val() );
        }
      }

      // 外側デザイン - 文字色（PC/SP振り分けあり）
      // 「外側」が選択されていて、さらに文字入れ加工選択が「インク注入」or「プリント加工」だったら、色指定を必須にする。
      let $type2 = $('.outer_textType1 input[type="radio"]:checked');
      if( $type2.length && ( $type2.val() == 3 || $type2.val() == 4 ) ){
        if( $(window).width() > 768 ){
            $('[name="ext_col_07"]').val( $('[name="outer_color1"]').val() );
        }else{
          let $other = $('[name="outer_color1_text_sp"]');
          let $select = $other.closest('dd').find('.selectorHead1');
          if( $select.html() != '選択してください' ){
            $('[name="ext_col_07"]').val( $select.html() );
          }else{
            $('[name="ext_col_07"]').val( $other.val() );
          }
        }
      }

      // 外側デザイン - フォント指定（PC/SP振り分けあり）
      if( $(window).width() > 768 ){
        if( $('[name="outer_textFont"]:checked').val() == '11' ){
          $('[name="ext_col_08"]').val( $('[name="outer_textFont"]:checked').val() + ':' + $('[name="outer_textFont_text"]').val() );
        }else{
          $('[name="ext_col_08"]').val( $('[name="outer_textFont"]:checked').val() + ':' + $('[name="outer_textFont"]:checked').next().find('span').html() );
        }
      }else{
        let $other = $('[name="outer_textFont_text_sp"]');
        let $select = $other.closest('dd').find('.selectorHead1');
        if( $select.html() != '選択してください' ){
          $('[name="ext_col_08"]').val( $select.html() );
        }else{
          $('[name="ext_col_08"]').val( $other.val() );
        }
      }

      // 内側デザイン - フォント指定（PC/SP振り分けあり）
      if( $(window).width() > 768 ){
        if( $('[name="inner_textFont"]:checked').val() == '11' ){
          $('[name="ext_col_12"]').val( $('[name="inner_textFont"]:checked').val() + ':' + $('[name="inner_textFont_text"]').val() );
        }else{
          $('[name="ext_col_12"]').val( $('[name="inner_textFont"]:checked').val() + ':' + $('[name="inner_textFont"]:checked').next().find('span').html() );
        }
      }else{
        let $other = $('[name="inner_textFont_text_sp"]');
        let $select = $other.closest('dd').find('.selectorHead1');
        if( $select.html() != '選択してください' ){
          $('[name="ext_col_12"]').val( $select.html() );
        }else{
          $('[name="ext_col_12"]').val( $other.val() );
        }
      }

      // 希望納期
      let date_year = $('[name="date_year1"]').val();
      let date_month = $('[name="date_month1"]').val();
      let date_day = $('[name="date_day1"]').val();
      $('[name="ext_col_16"]').val( `${date_year}${date_month}${date_day}` );

      // 文字入れ加工に
      // 「なし」または「外側のみ」を選択している場合は、内側の項目を空欄にする。
      // 「なし」または「内側のみ」を選択している場合は、外側の項目を空欄にする。
      if(
        $('.txt_type1 input[type="radio"]:checked').val() == '1' ||
        $('.txt_type1 input[type="radio"]:checked').val() == '2'
      ){ // 「なし」または「外側のみ」のとき、内側の項目を空欄にする
        $('input[name="ext_col_11"]').val('');
        $('input[name="ext_col_12"]').val('');
        $('select[name="ext_col_13"]').val('');
        $('textarea[name="ext_col_14"]').val('');
      }
      if(
        $('.txt_type1 input[type="radio"]:checked').val() == '1' ||
        $('.txt_type1 input[type="radio"]:checked').val() == '3'
      ){ // 「なし」または「内側のみ」のとき、外側の項目を空欄にする
        $('input[name="ext_col_05"]').val('');
        $('input[name="ext_col_06"]:checked').prop('checked',false);
        $('input[name="ext_col_07"]').val('');
        $('input[name="ext_col_08"]').val('');
        $('select[name="ext_col_09"]').val('');
        $('textarea[name="ext_col_10"]').val('');
      }
    }

    // （６）見積フォームのphase2への移動実装
    $('[data-js="estimateForm_btnToStep2"]').click(function(e){
      e.preventDefault();

      // 全エラー解除
      $('.-hasFormError').removeClass('-hasFormError');

      // バリデーション
      if( estimateFormValidation01() ){

        // 本当のフォームへの入力
        estimateFormToRealForm();

        // フローを２に進める
        $('body').attr('data-EstimateFormFlow','2');
      }

      // トップへスクロールする
      $('body, html').scrollTop(0);
    });

    // （７）見積フォームのカラーセレクタ実装（PC）（※フォーム入稿のみ）
    if(page_type == 'form'){
      (function(){
        if( $('[data-js="estimateForm_colorSelector1"]').length ){
          $('[data-js="estimateForm_colorSelector1"]').find('.inner > ul > li').on('click',function(){
            let text = $(this).html().replace(/<span.*span>/,'');
            $('[name="band_color"]').val(text);
          });
        }
    
        if( $('[data-js="estimateForm_colorSelector2"]').length ){
          $('[data-js="estimateForm_colorSelector2"]').find('.inner > ul > li').on('click',function(){
            let text = $(this).html().replace(/<span.*span>/,'');
            $('[name="outer_color1"]').val(text);
          });
        }
      })();
    }

    // （８）見積フォームのカスタムセレクタ実装（SP）（※フォーム入稿のみ）
    if(page_type == 'form'){
      (function(){
        let $parent = $('.customSelector1');
        $parent.each(function(){
          let $p = $(this);
          $p.find('.selectorList1 > ul > li').on('click',function(){
            $p.removeClass('-hasFormError');
            $p.find('.-active').removeClass('-active');
            $(this).addClass('-active');
      
            let data = $(this).html().replace(/<span.*span>/,'');
            $p.find('.selectorHead1').addClass('-selected').html(data);
            $p.find('[data-acc-roll="trigger"]').click();
          });
        });
    
        $parent = $('.customSelector2');
        $parent.each(function(){
          let $p = $(this);
          $p.find('.selectorList1 > ul > li').on('click',function(){
            $p.removeClass('-hasFormError');
            $p.find('.-active').removeClass('-active');
            $(this).addClass('-active');
      
            let data = $(this).html().replace(/<img.*>/,'');
            $p.find('.selectorHead1').addClass('-selected').html(data);
            $p.find('[data-acc-roll="trigger"]').click();
          });
        });
      })();
    }

    // バリデーション02（Step2 -> Step3）
    const estimateFormValidation02 = function(){

      let errorFlag = false;
  
      // 汎用
      $('.pageEstimateForm-form2 [data-js="estimateForm_validationRequire"]').each(function(){
        if( $(this).val() === '' ){
          $(this).parent().addClass('-hasFormError');
          errorFlag = true;
        }
      });
  
      // 氏名
      if( $('[name="ext_col_17"]').val()=='' || $('[name="ext_col_18"]').val()=='' ){
        $('[name="ext_col_17"]').closest('dd').addClass('-hasFormError');
        errorFlag = true;
      }
  
      // メールアドレス
      let mail01 = $('[name="ext_col_19"]').val();
      let reg = /^.+@.+\..+$/;
      if( mail01 != ''){
        if( !mail01.match(reg) ){
          // エラーメッセージ変更
          $('[name="ext_col_19"]').closest('dd').find('.form-errorTxt').html('<span>！</span>メールアドレスの形式が間違っています。');
          $('[name="ext_col_19"]').closest('dd').addClass('-hasFormError');
          errorFlag = true;
        }
      }else{
        // エラーメッセージをもとに戻す
        $('[name="ext_col_19"]').closest('dd').find('.form-errorTxt').html('<span>！</span>ご入力ください');
      }

      // 郵便番号
      let zipcode01 = $('[name="ext_col_21"]').val();
      reg = /^[0-9]{1,7}$/;
      if( zipcode01 != ''){
        if( !zipcode01.match(reg) ){
          // エラーメッセージ変更
          $('[name="ext_col_21"]').closest('li').find('.form-errorTxt').html('<span>！</span>郵便番号の形式が間違っています。');
          $('[name="ext_col_21"]').closest('li').addClass('-hasFormError');
          errorFlag = true;
        }
      }else{
        // エラーメッセージをもとに戻す
        $('[name="ext_col_21"]').closest('li').find('.form-errorTxt').html('<span>！</span>ご入力ください');
      }

      // ご希望の決済方法
      if( !$('[name="ext_col_28"]:checked').length ){
        $('[name="ext_col_28"]').closest('dd').addClass('-hasFormError');
        $('[name="ext_col_28"]').click(function(){
          $(this).closest('dd').removeClass('-hasFormError');
        });
        errorFlag = true;
      }
  
      if(errorFlag){
        return false;
      }else{
        return true;
      }
    }

    // （９）見積フォームのphase3への移動実装
    $('[data-js="estimateForm_btnToStep3"]').click(function(e){
      e.preventDefault();

      // 全エラー解除
      $('.-hasFormError').removeClass('-hasFormError');

      // バリデーション
      if(page_type == 'form'){  // フォーム入稿の場合
        if( estimateFormValidation02() ){
          $('form#ajaxform input[type="submit"]').click();
        }
      }else{  // データ入稿の場合
        let result1 = estimateFormValidation01();
        let result2 = estimateFormValidation02();
        if( result1 && result2 ){

          // 本当のフォームへの入力
          estimateFormToRealForm();

          $('form#ajaxform input[type="submit"]').click();
        }else{
          // バリデーションエラーだった場合、トップへスクロールする
          $('body, html').scrollTop(0);
        }
      }
    });

    // （１０）見積フォームのphase3への移動実装
    $('[data-js="estimateForm_btnToStep4"]').click(function(e){
      e.preventDefault();
      $('form#ajaxform input[type="submit"]').click();
    });
  }

  /**
  * マイページの初期化
  * 
  * @return {boolean} false
  */
   const initMypage = function(){

    // マイページ以外だったら、何もしない
    if(
      $('body').attr('id') != 'page_mypage'
    ){
      return false;
    }

    // （１）お見積り履歴の詳細開く閉じる機能実装
    (function(){
      let $el_acc = $('[data-js="mypageAcc"]');

      $el_acc.each(function(){

        let $parent = $(this);
        let $trigger_open = $parent.find('[data-mypageAcc-roll="triggerOpen"] > a');
        let $trigger_close = $parent.find('[data-mypageAcc-roll="triggerClose"] > a');
        let $contents = $parent.find('[data-mypageAcc-roll="contents"]');      

        // openボタンクリック時の処理
        $trigger_open.on('click',function(e){

          e.preventDefault();

          if($parent.attr('data-mypageAcc-state') !== 'closed'){
            return false;
          }
          $parent.attr('data-mypageAcc-state','opening');
          $contents.slideDown('300',function(){
            $parent.attr('data-mypageAcc-state','opened');
          });
        });

        // closeボタンクリック時の処理
        $trigger_close.on('click',function(e){

          e.preventDefault();

          if($parent.attr('data-mypageAcc-state') !== 'opened'){
            return false;
          }
          $parent.attr('data-mypageAcc-state','closing');
          $contents.slideUp('300',function(){
            $parent.attr('data-mypageAcc-state','closed');
          });
        });

      });
    })();

    // （２）住所自動入力の処理実装
    $('[data-js="getAddressByZipcode"]').on('click',function(e){
      e.preventDefault();

      let zipcode1 = $('#customer_zipcode1').val();

      if(zipcode1 == ''){
        alert('郵便番号をご入力ください');
        return false;
      }

      // ajaxでのapi呼び出し
      $.ajax({	
        url:"https://zipcloud.ibsnet.co.jp/api/search",
        type:"GET",
        data:{
          zipcode: zipcode1,
          limit: 1,
        },
        dataType:"json",
        timespan:3000
      }).done(function(rawdata,textStatus,jqXHR) {

          // オブジェクトに変換
          var data1 = JSON.parse(JSON.stringify(rawdata));

          if(!data1.results){
            alert('住所が取得できませんでした。');
          }else{
            // フォームに入力
            $('#customer_prefecture1').val(data1.results[0].prefcode);
            $('#customer_address1').val(data1.results[0].address2);
            $('#customer_address2').val(data1.results[0].address3);
          }  
      }).fail(function(jqXHR, textStatus, errorThrown ) {
        alert('住所が取得できませんでした。');
      })
    });

    // （３）郵便番号（7ケタ）を入力すると、実際のフォーム（３ケタ＋４ケタ）に入力する。
    $('#customer_zipcode1').on('change',function(){

      let $zip1 = $('[name="member_edit[zip_main]"]');
      let $zip2 = $('[name="member_edit[zip_sub]"]');

      // ケタ数チェック
      if( $(this).val().length != 7 ){
        $zip1.val('');
        $zip2.val('');
      }else{
        $zip1.val( $(this).val().slice(0,3) );
        $zip2.val( $(this).val().slice(-4) );
      }
    });

    // バリデーション
    const isValidMypageForm = function(){

      let errorFlag = false;
  
      // 汎用
      $('[data-js="estimateForm_validationRequire"]').each(function(){
        if( $(this).val() === '' ){
          $(this).parent().addClass('-hasFormError');
          errorFlag = true;
        }
      });
  
      // 氏名
      let $name1 = $('[name="member_edit[name1]"]');
      let $name2 = $('[name="member_edit[name2]"]');
      if( $name1.val()=='' || $name2.val()=='' ){
        $name1.closest('dd').addClass('-hasFormError');
        errorFlag = true;
      }
  
      // メールアドレス
      let $mail1 = $('[name="member_edit[email]"]');
      let reg = /^.+@.+\..+$/;
      if( $mail1.val() != ''){
        if( !$mail1.val().match(reg) ){
          // エラーメッセージ変更
          $mail1.closest('dd').find('.form-errorTxt').html('<span>！</span>メールアドレスの形式が間違っています。');
          $mail1.closest('dd').addClass('-hasFormError');
          errorFlag = true;
        }
      }else{
        // エラーメッセージをもとに戻す
        $mail1.closest('dd').find('.form-errorTxt').html('<span>！</span>ご入力ください');
      }

      // 郵便番号
      let $zipcode1 = $('#customer_zipcode1');
      reg = /^[0-9]{7}$/;
      if( $zipcode1.val() != ''){
        if( !$zipcode1.val().match(reg) ){
          // エラーメッセージ変更
          $zipcode1.closest('li').find('.form-errorTxt').html('<span>！</span>郵便番号の形式が間違っています。');
          $zipcode1.closest('li').addClass('-hasFormError');
          errorFlag = true;
        }
      }else{
        // エラーメッセージをもとに戻す
        $zipcode1.closest('li').find('.form-errorTxt').html('<span>！</span>ご入力ください');
      }
      if(errorFlag){
        return false;
      }else{
        return true;
      }
    }    

    // （４）サブミット時の処理
    $('[data-js="mypageSubmit"]').on('click',function(e){
      e.preventDefault();

      // 全エラー解除
      $('.-hasFormError').removeClass('-hasFormError');

      // バリデーション
      if( isValidMypageForm() ){
        // console.log('validation is ok!!');
        $(this).closest('form').submit();
      }
    });

    // （５）SPの詳細を表示する機能
    $('[data-js="mypageShowDetail"]').on('click',function(e){
      e.preventDefault();

      // ターゲット記事をアクティブにする
      let targetId = $(this).attr('data-mypageTargetId');
      $('[data-mypageHistoryId="' + targetId + '"]').addClass('active');

      // bodyのパラメータを変更
      $('body').attr('data-mypage','detail');

      // トップへスクロールする
      $('body, html').scrollTop(0);
    });

    // （６）詳細ページから戻る機能
    $('[data-js="mypageBackToList"]').on('click',function(e){

      e.preventDefault();

      // activeクラス削除
      $('.active[data-mypageHistoryId]').removeClass('active');

      // bodyのパラメータを変更
      $('body').attr('data-mypage','list');

      // トップへスクロールする
      $('body, html').scrollTop(0);
    });

  }
}(jQueryLatest));
