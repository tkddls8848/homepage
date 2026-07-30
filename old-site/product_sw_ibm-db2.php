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
  <link rel="stylesheet" href="css/product.css">
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


        <section class="main_slide">

            <div class="slider">
                <div class="slide_btn">
                    <div class="prev"><a></a></div>
                    <div class="next"><a></a></div>
                </div>
                <div class="slide_window">
                    <div class="slide_track">
                        <div class="slide" style="opacity: 1;">
                            <h2>4차 산업혁명의 <br>선두기업</h2>
                            <img src="images/photo/slide/slide_01.png">
                        </div>
                        <div class="slide">
                            <h2>뉴노멀시대의 <br>선두기업</h2>
                            <img src="images/photo/slide/slide_02.png">
                        </div>
                    </div>
                </div>
            </div>

        </section>
        

        <div class="tab">
            <div class="t_about">
                <a href="./about-us_about.php#scroll">
                    <h3>
                        회사소개
                        <p>
                            20년 이상의 전문 경력을 바탕으로 IT Service <br>
                            전문대표기업으로 새롭게 태어났습니다!<br>
                            정보통신산업의 든든한 기둥!<br>
                            정보강국의 첨병이 되어 대한민국 종합정보통신의 <br>
                            살아있는 역사를 바로 세워가겠습니다.
                        </p>
                    </h3>
                    
                </a>
            </div>
            <div class="t_infra">
                <a href="./it-infra-service_consulting.php#scroll">
                    <h3>IT Infra Service</h3>
                </a>
            </div>
            <div class="t_product active">
                <a href="./index.php#scroll">
                    <h3>Product</h3>
                </a>
            </div>
        </div>

        <div class="m_tab">
            <div class="t_about">
                <a href="./about-us_about.php#scroll">
                    <h3>
                        회사소개
                    </h3>
                </a>
            </div>
            <div class="t_infra">
                <a href="./it-infra-service_consulting.php#scroll">
                    <h3>IT Infra Service</h3>
                </a>
            </div>
            <div class="t_product active">
                <a href="./index.php#scroll">
                    <h3>Product</h3>
                </a>
            </div>
            <i class="drawer_tab" style="transform: rotate(0deg);">
                <img src="../../images/icon/nav/arrow_down.png">
            </i>
        </div>

        <i id="scroll"></i>

        <div class="inside_tab">
            <div class="primary">
                <div class="inner">
                    <ul>
                        <li><a href="./index.php#scroll">IBM</a></li>
                        <li><a href="./product_lenovo_x86-server.php#scroll">Lenovo</a></li>
                        <li><a href="./product_dell_x86-server.php#scroll">Dell</a></li>
                        <li class="active"><a href="./product_sw_ibm-spectrum-scale.php#scroll">S/W</a></li>
                    </ul>
                </div>
            </div>
            <div class="secondary">
                <div class="inner">
                    <ul>
                        <li><a href="./product_sw_ibm-spectrum-scale.php#scroll">IBM Spectrum Scale</a></li>
                        <li class="active"><a href="./product_sw_ibm-db2.php#scroll">IBM Db2</a></li>
                        <li><a href="./product_sw_ibm-web-sphere.php#scroll">IBM Web Sphere</a></li>
                        <li><a href="./product_sw_ibm-instana.php#scroll">IBM Instana</a></li>
                        <li><a href="./product_sw_cider.php#scroll">Cider 솔루션</a></li>
                    </ul>
                </div>
            </div>
        </div>


        <section class="content_standard">
            <div class="inner">
                <div class="title">
                    <h2>
                        IBM Db2
                    </h2>
                </div>
                <div class="body">
                    <div class="product_sw_wrapper">



                        <article class="headline">
                            <div>
                                <h3>
                                    IBM 데이터베이스 관리 툴 제품군을 통해 
                                    데이터베이스 시스템을 통합적으로 설계, 
                                    개발, 테스트, 모니터링, 마이그레이션, 관리할 수 있습니다. 
                                </h3>
                                <h4>
                                    IBM 툴을 사용하면 데이터베이스 관리를 개선하고 성능 및 
                                    가용성을 최적화하며, 생산성을 높이고 비용을 절감하면서도 
                                    데이터의 개인정보 보호, 보안, 무결성을 유지할 수 있습니다.
                                </h4>
                            </div>
                        </article>

                        <article class="body">
                            <div class="left">
                                <h3>Function</h3>
                                <ul>
                                    <li>
                                        <h4>
                                            IBM BLU Acceleration
                                        </h4>
                                        <p><em>
                                            IBM 인메모리 기술은 실행 가능한 인사이트를 얻는 데 필요한 
                                            획기적인 성능을 제공합니다. SAP 인증 기술을 통해 SAP 투자에서 
                                            더 적은 리소스로 더 뛰어난 성능을 발휘합니다.
                                            IBM pureScale 가용성 유지를 위해 여러 호스트를 통해 데이터에 
                                            액세스합니다. 
                                            IBM Db2 pureScale은 온라인 트랜잭션 처리(OLTP)에 고가용성이 
                                            요구되는 비즈니스 프로세스용으로 설계되었습니다. 
                                            운영에 빅데이터를 접목하는 데 좋은 방법입니다.
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            고급 스토리지 최적화
                                        </h4>
                                        <p><em>
                                            인메모리 종횡 배열 기술과 병렬 벡터 처리, 데이터 건너뛰기, 
                                            데이터 압축 기능을 활용하여 인메모리 전용 시스템의 제약 없이 
                                            인사이트를 빠르게 발견할 수 있습니다.
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            Flex Points 라이센싱
                                        </h4>
                                        <p><em>
                                            IBM Hybrid Data Management Platform으로 유형, 소스, 구조와 
                                            관계없이 모든 가용데이터를 활용할 수 있습니다. 
                                            단일 구독 기반 라이센스로 IBM FlexPoints를 구매하여 여러 리소스에 
                                            할당하기만 하면 됩니다
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            스토리지 최적화
                                        </h4>
                                        <p><em>
                                            데이터를 투명하게 압축해 디스크 공간을 절약하여 스토리지 인프라의 
                                            효율을 높일 수 있습니다. 
                                            IBM Db2®의 스토리지 최적화 기능을 사용하면 성능을 향상하고 작업에 
                                            소요되는 시간을 단축하며 작업 처리에 필요한 전력 소비량을 
                                            크게 줄일 수 있습니다.
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            SQL 호환성
                                        </h4>
                                        <p><em>
                                            Oracle 데이터베이스용으로 만들어진 레거시 애플리케이션을 
                                            Db2로 옮기는 데 수반되는 비용과 리스크를 크게 줄여 줍니다. 
                                            즉, 기존 기술과 자산을 사용하여 더욱 빠르고 쉽게 마이그레이션 
                                            할 수 있습니다.
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            장애 복구
                                        </h4>
                                        <p><em>
                                            Db2를 통해 소스 데이터베이스에서 데이터 변경사항을 복제하여 
                                            부분 및 전체 사이트 장애로 데이터가 손실되지 않도록 방지합니다.
                                        </em></p>
                                    </li>
                                </ul>
                            </div>
                            <div class="right">
                                <h3>Adventage</h3>
                                <ul>
                                    <li>
                                        <h4>
                                            고성능
                                        </h4>
                                        <p><em>
                                            Db2 운영 데이터베이스를 통해 인메모리 기술과 스토리지 최적화, 
                                            워크로드 관리, 지속적인 가용성을 확보 할 수 있습니다. 
                                            분석은 팀이 더욱 빠른 의사결정을 내릴 수 있도록 도와줍니다.
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            언제나 사용가능
                                        </h4>
                                        <p><em>
                                            고가용성 및 재해 복구 기능을 제공하는 서버를 사용하므로 계획된 
                                            가동 중단 및 계획되지 않은 가동 중단의 영향을 최소화할 수 있습니다.
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            보안이 강화된 환경
                                        </h4>
                                        <p><em>
                                            엔터프라이즈 데이터 애플리케이션과 웨어하우징 프로젝트 관리를 
                                            간소화하는 데 도움이 되는 방식의 강력한 기업용 보안 및 암호화를 경험해 보세요.
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            데이터베이스 관리 툴을 다음과 같은 부분에 활용할 수 있습니다.
                                        </h4>
                                        <p><em>
                                            요구사항에서 폐기에 이르기까지 라이프사이클 전반에 걸쳐 데이터 관리<br>
                                            데이터베이스 환경의 전반적인 상태 모니터링<br>
                                            조회 워크로드, 데이터베이스, 애플리케이션의 성능 분석 및 최적화<br>
                                            설치, 구성, 패치, 업그레이드, 백업 및 복원, 데이터베이스 복제, 테스트 관리, 
                                            데이터 정리 루틴과 같은 작업의 가속화 및 간소화<br>
                                            공유 정책, 모델, 방법론을 통한 데이터 품질 및 일관성 개선<br>
                                            클라우드 및 온프레미스 시스템 간 데이터 마이그레이션<br>
                                        </em></p>
                                    </li>
                                </ul>
                            </div>
                        </article>

                        <article class="additional">
                            <div class="add_title">
                                <h3>
                                    IBM Storage for Data and AI 정보 아키텍처의 핵심인 
                                    IBM Spectrum Scale
                                </h3>
                                <i></i>
                            </div>
                            <div class="add_cont">
                                <dl>
                                    <dt>
                                        <h4><strong>
                                            혁신 가속화
                                        </strong></h4>
                                    </dt>
                                    <dd>
                                        <p>
                                        IBM 개발 및 테스트 툴을 사용하면 심층 모니터링 기능을 갖춘 단일 대시 보드 뷰, 
                                        오류를 쉽게 감지하고 수정하는 조회 최적화 기능, SQL 코드 최적화를 위한 자동화된 
                                        권장사항 등을 통해 IBM Db2® 기반을 개선하고 강점을 강화할 수 있습니다.
                                        </p>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <h4><strong>
                                            성능 최적화
                                        </strong></h4>
                                    </dt>
                                    <dd>
                                        <p>
                                            성능 관리 및 최적화용 IBM 툴을 사용하면 성능 병목 현상을 파악, 진단, 해결, 
                                            방지할 수 있는 베스트 프랙티스 방법론 구현에 도움이 됩니다. 
                                            이를 통해 데이터베이스 환경의 효율성과 전반적인 상태를 최고 상태로 유지할 수 있습니다.
                                        </p>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <h4><strong>
                                            가용성 증가
                                        </strong></h4>
                                    </dt>
                                    <dd>
                                        <p>
                                            IBM DB2 Advanced Recovery Feature를 사용하면 늘어나는 파트너와 
                                            고객의 기대치에 부응할 수 있습니다. 
                                            이 기능을 통해 데이터 보호, 신속한 복구, 애플리케이션 가동 시간 극대화, 
                                            가동 중단 시간 비용 최소화를 실현할 수 있습니다.
                                        </p>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <h4><strong>
                                            경쟁 우위 확보
                                        </strong></h4>
                                    </dt>
                                    <dd>
                                        <p>
                                            통합된 데이터 관리 툴을 통해 데이터에 이상적인 기반을 구축할 수 있습니다. 
                                            확장 가능한 고성능 툴을 사용하면 가용성 문제를 예측하여 라이프사이클 
                                            전반에서 데이터를 비용 효율적으로 관리하고 모니터링하여 
                                            경쟁력을 유지할 수 있습니다.
                                        </p>
                                    </dd>
                                </dl>
                            </div>
                        </article>



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
    </footer>    <script src="js/hamberger.js"></script>
    <script src="js/tab.js"></script>
    <script src="js/open_tab.js"></script>
    <script src="js/open_footer.js"></script>
    <script src="js/slider.js"></script>
    <script src="js/id_control.js"></script>

</body>
</html>