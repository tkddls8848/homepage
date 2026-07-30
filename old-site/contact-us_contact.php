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
  crossorigin="anonymous"></script>    <!-- <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Trial Info</title>
    <link rel="stylesheet" href="css/nav.css">
    <link rel="stylesheet" href="css/base.css"> -->
    <link rel="stylesheet" href="css/about.css">
    <script src="./js/jquery-3.5.1.min.js"></script>
    <script charset="UTF-8" class="daum_roughmap_loader_script" src="https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js"></script>
    <script src="./js/contact.js"></script>
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
                        <li class="active"><a href="./contact-us_contact.php">오시는 길</a></li>
                        <li><a href="./contact-us_inquiry.php">문의하기</a></li>
                    </ul>
                </div>
            </div>
        </div>


        <section class="content_standard tab_alone">
            <div class="inner">
                <div class="title">
                    <h2>
                        오시는 길
                    </h2>
                </div>
                <div class="body">
                    <div class="contact_wrapper">

                        <ul class="dpt_name">
                            <li class="selected">
                                <a>
                                    <p><strong>본사</strong></p>
                                </a>
                            </li>
                            <li>
                                <a>
                                    <p><strong>원주지사</strong></p>
                                </a>
                            </li>
                            <li>
                                <a>
                                    <p><strong>전주지사</strong></p>
                                </a>
                            </li>
                        </ul>

                        <div class="map">
                            <div id="daumRoughmapContainer1607656468304" class="root_daum_roughmap root_daum_roughmap_landing"></div>
                            <div id="daumRoughmapContainer1607660737326" class="root_daum_roughmap root_daum_roughmap_landing"></div>
                            <div id="daumRoughmapContainer1607660867045" class="root_daum_roughmap root_daum_roughmap_landing"></div>
                        </div>

                        <ul class="dpt">
                        <li class="selected">
                                <a>
                                    <p><strong>본사</strong></p>
                                    <p>서울특별시 영등포구 선유로 13길 25, 1312 ~ 1314호</p>
                                    <p>TEL : 02-6972-1521</p>
                                    <p>E-Mail : master@trialinfo.com</p>
                                </a>
                            </li>
                            <li>
                                <a>
                                    <p><strong>원주지사</strong></p>
                                    <p>강원도 원주시 건강로 25, 406호</p>
                                    <p>TEL : 02-6972-1527</p>
                                    <p>E-Mail : master@trialinfo.com</p>
                                </a>
                            </li>
                            <!-- <li>
                                <a>
                                    <p><strong>전주지사</strong></p>
                                    <p>전라북도 전주시 덕진구 오공로 132, 1동 302호</p>
                                    <p>TEL : 02-6972-1533</p>
                                    <p>E-Mail : master@trialinfo.com</p>
                                </a>
                            </li> -->
                        </ul>

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
    </footer>    <script src="js/map.js"></script>
    <script src="js/white_header.js"></script>
    <script src="js/hamberger.js"></script>
    <script src="js/open_tab.js"></script>
    <script src="js/open_footer.js"></script>

</body>
</html>