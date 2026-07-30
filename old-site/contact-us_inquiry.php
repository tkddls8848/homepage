<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>Trial Info</title>
<link rel="stylesheet" href="css/nav.css">
<link rel="stylesheet" href="css/base.css">
<script src="https://code.jquery.com/jquery-3.5.1.min.js"
  integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
  crossorigin="anonymous"></script>  <!-- <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Trial Info</title>
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/base.css"> -->
  <link rel="stylesheet" href="css/about.css">
</head>
<body>

    <header>
    <i class="wt_bg" style="display: block;"></i>
    <div class="inner">
        <h1>
            <a href="./index.php" style="background: transparent;">
                <img src="../../images/logo/logo.svg">
                <img src="../../images/logo/logo_wt.svg">
            </a>
        </h1>
        <nav>
            <ul>
                <li><a href="./about-us_about.php#scroll">About Us</a></li>
                <li><a href="./index.php#scroll">Product</a></li>
                <li><a href="./it-infra-service_consulting.php#scroll">IT Infra</a></li>
                <li><a href="./career.php">Career</a></li>
                <li><a href="./contact-us_contact.php">Contact Us</a></li>
            </ul>
            <i class="btn_close">
                <img src="../../images/icon/nav/close.png">
            </i>
        </nav>
        <i class="btn_ham">
            <img src="../../images/icon/nav/hamburger.png">
            <img src="../../images/icon/nav/hamburger_wt.png">
        </i>
    </div>
    <div class="popup_wrapper" id="page_is_not_ready">
        <div class="popup">
            <p>
                <strong>페이지가 준비중에 있습니다.</strong>
            </p>
            <a href="#close">확인</a>
        </div>
        <a class="popup_bg" href="#close"></a>
    </div>
</header>
    <script src="js/bg.js"></script>
    <!-- <header>
        <div class="inner">
            <h1><a></a></h1>
            <nav>
                <ul>
                    <li><a>About Us</a></li>
                    <li><a>Product</a></li>
                    <li><a>IT Infra</a></li>
                    <li><a>Career</a></li>
                    <li><a>Contact Us</a></li>
                </ul>
            </nav>
        </div>
    </header> -->



    <div id="container">

        <div class="inside_tab">
            <div class="primary t_fixed tab_alone">
                <div class="inner">
                    <ul>
                        <li><a href="./contact-us_contact.php">오시는 길</a></li>
                        <li class="active"><a href="./contact-us_inquiry.php">문의하기</a></li>
                    </ul>
                </div>
            </div>
        </div>


        <section class="content_standard tab_alone">
            <div class="inner">
                <div class="title">
                    <h2>
                        문의하기
                    </h2>
                </div>
                <div class="body">
                    <div class="inquiry_wrapper">
                        <form method="POST" action="./inquiry_post.php">
                        
                            <div class="inquiry">
                                <div class="tag">
                                    <h5>
                                        관심 솔루션<i>*</i>
                                    </h5>
                                </div>
                                <div class="input">
                                    <input type="radio" id="hw" name="solution" value="H/W" checked>
                                    <label for="hw">H/W</label>
                                    <input type="radio" id="sw" name="solution" value="S/W">
                                    <label for="sw">S/W</label>
                                    <i></i>
                                </div>
                            </div>
                            
                            <div class="inquiry">
                                <div class="tag">
                                    <h5>
                                        성명<i>*</i>
                                    </h5>
                                </div>
                                <div class="input col2">
                                    <input type="text" name="name" placeholder="성명을 입력해주세요.">
                                    <input type="text" name="position" placeholder="직책을 입력해주세요.">
                                </div>
                            </div>
                            
                            <div class="inquiry">
                                <div class="tag">
                                    <h5>
                                        회사정보
                                    </h5>
                                </div>
                                <div class="input col2">
                                    <input type="text" name="company" placeholder="회사명을 입력해주세요.">
                                    <input type="text" name="department" placeholder="부서명을 입력해주세요.">
                                </div>
                            </div>
                            
                            <div class="inquiry">
                                <div class="tag">
                                    <h5>
                                        연락처 정보<i>*</i>
                                    </h5>
                                </div>
                                <div class="input col2">
                                    <input type="tel" name="phone" placeholder="연락처를 입력해주세요.">
                                    <input type="email" name="email" placeholder="이메일을 입력해주세요.">
                                </div>
                            </div>
                            
                            <div class="inquiry full">
                                <div class="tag">
                                    <h5>
                                        문의내용<i>*</i>
                                    </h5>
                                </div>
                                <div class="input">
                                    <div class="radio">
                                        <input type="radio" id="i_tech" name="inq_type" value="제품 기술문의" checked>
                                        <label for="i_tech"><i></i><span>제품 기술문의</span></label>
                                        <input type="radio" id="i_cost" name="inq_type" value="견적문의">
                                        <label for="i_cost"><i></i><span>견적 문의</span></label>
                                        <input type="radio" id="i_help" name="inq_type" value="지원요청">
                                        <label for="i_help"><i></i><span>지원요청</span></label>
                                        <input type="radio" id="i_other" name="inq_type" value="기타">
                                        <label for="i_other"><i></i><span>기타</span></label>
                                    </div>
                                    <textarea name="content" placeholder="문의내용을 입력해주세요."></textarea>
                                </div>
                            </div>

                            <div class="send">
                                <button type="submit">전송하기</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <footer>
        <div class="inner">
            <h5>
                <a href="./index.php"><img src="../../images/logo/logo_wt.svg"></a>
            </h5>
            <nav class="footer_nav">
                <ul>
                    <li>
                        <dl>
                            <i></i>
                            <dt>About Us</dt>
                            <dd><a href="./about-us_about.php#scroll">회사개요</a></dd>
                            <dd><a href="./about-us_history.php#scroll">회사연혁</a></dd>
                            <dd><a href="./about-us_division.php#scroll">조직도</a></dd>
                        </dl>
                        <dl>
                            <i></i>
                            <dt>Product</dt>
                            <dd><a href="./index.php#scroll">IBM</a></dd>
                            <dd><a href="./product_lenovo_x86-server.php#scroll">Lenovo</a></dd>
                            <dd><a href="./product_dell_x86-server.php#scroll">Dell</a></dd>
                            <dd><a href="./product_sw_ibm-spectrum-scale.php#scroll">S/W</a></dd>
                        </dl>
                    </li>
                    <li>
                        <dl>
                            <i></i>
                            <dt>IT Infra</dt>
                            <dd><a href="./it-infra-service_consulting.php#scroll">Consulting</a></dd>
                            <dd><a href="./it-infra-service_it-infra-build.php#scroll">IT Infra 구축</a></dd>
                            <dd><a href="./it-infra-service_maintenance.php#scroll">Maintenance</a></dd>
                        </dl>
                        <dl>
                            <i></i>
                            <dt>Career</dt>
                            <dd><a href="./career.php">Career</a></dd>
                        </dl>
                    </li>
                    <li>
                        <dl>
                            <i></i>
                            <dt>Contact Us</dt>
                            <dd><a href="./contact-us_contact.php">오시는 길</a></dd>
                            <dd><a href="./contact-us_inquiry.php">문의하기</a></dd>
                        </dl>
                    </li>
                </ul>
            </nav>
            <div>
                <h5>
                    (주)트라이얼정보통신
                </h5>
                <ul>
                    <li><a href="./etc_recruit.php">채용정보</a></li>
                    <li><a href="./etc_ethics.php">윤리강령</a></li>
                    <li><a href="./etc_privacy-policy.php">개인정보취급방침</a></li>
                </ul>
                <address>
                    <p>
                        <strong style="color: #fff; font-size: 16px; font-weight: 400; line-height: 40px;">(주)트라이얼정보통신</strong>
                    </p>
                    <p>
                        <span>(우) 07282 서울특별시 영등포구 선유로 13길 25, 1312 ~ 1314호</span>
                        <span>(문래동6가, 에이스하이테크시티2차)</span>
                    </p>
                    <p>
                        <span>TEL : 02-6972-1521</span>
                        <span>FAX : 02-6972-1525</span>
                        <span>E-mail : master@trialinfo.com</span>
                    </p>
                </address>
                <p>
                    <small>Copyrights 2020 logo. All rights reserved.</small>
                </p>
            </div>
        </div>
    </footer>    <script src="js/white_header.js"></script>
    <script src="js/hamberger.js"></script>
    <script src="js/open_tab.js"></script>
    <script src="js/open_footer.js"></script>

</body>
</html>