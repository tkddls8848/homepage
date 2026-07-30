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
                        <li class="active"><a href="./product_sw_ibm-spectrum-scale.php#scroll">IBM Spectrum Scale</a></li>
                        <li><a href="./product_sw_ibm-db2.php#scroll">IBM Db2</a></li>
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
                        IBM Spectrum
                        <br>
                        Scale
                    </h2>
                </div>
                <div class="body">
                    <div class="product_sw_wrapper">



                        <article class="headline">
                            <div>
                                <h3>
                                    빠르게 인사이트를 제공하며 
                                    빠르게 확장하는 인프라를 관리할 수 있는 조직이 
                                    곧 업계의 리더가 됩니다. 
                                </h3>
                                <h4>
                                    이러한 인사이트를 제공함에 있어서, 기업의 기본 정보 아키텍처는 보안성, 
                                    안정성, 데이터 효율성 및 고성능을 보장하면서도 기존의 애플리케이션과 함께 
                                    하이브리드 클라우드, 빅데이터 및 인공지능(AI) 워크로드를 지원할 수 있어야 합니다.
                                </h4>
                                <h4>
                                    IBM Spectrum Scale™은 준비된 아카이브와 분석을 수행할 수 있는 
                                    차별화된 기능으로 규모에 맞게 데이터를 관리하기 위한 글로벌 파일 및 
                                    오브젝트 데이터 액세스 기능을 갖춘 고성능의 병렬 솔루션으로서 이러한 문제를 해결합니다.
                                </h4>
                            </div>
                        </article>

                        <article class="body">
                            <div class="left">
                                <h3>Function</h3>
                                <ul>
                                    <li>
                                        <h4>
                                            Kubernetes 및 IBM Spectrum Scale
                                        </h4>
                                        <p><em>
                                            Container Native Storage 액세스는 현재 고성능 Spectrum Scale 노드의 
                                            IBM Spectrum Scale 액세스 및 클러스터 데이터를 컨테이너화합니다.
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            오브젝트 스토리지의 고급 파일 관리(AFM)
                                        </h4>
                                        <p><em>
                                        네이티브 오브젝트 스토리지는 이제 고성능 글로벌 파일 시스템의 일부이며, 
                                        이는 오브젝트 스토리지 데이터에 대한 NVMe 액세스를 제공합니다.
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            Cloudera 및 IBM Spectrum Scale
                                        </h4>
                                        <p><em>
                                            IBM Spectrum Scale Hadoop 커넥터는 현재 Cloudera Analytics를 지원합니다.
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            IBM Cloud Pak for Data 및 IBM Watson에 대한 원클릭 통합
                                        </h4>
                                        <p><em>
                                            IBM Spectrum Discover에 대한 실시간 수집은 AI 워크플로우에 
                                            대한 부가적인 가치를 창출합니다.
                                        </em></p>
                                    </li>
                                </ul>
                            </div>
                            <div class="right">
                                <h3>Adventage</h3>
                                <ul>
                                    <li>
                                        <h4>
                                            최고의 확장성
                                        </h4>
                                        <p><em>
                                            병목현상 없는 아키텍처 채택으로 스토리지 확장 시에도 최고의 
                                            처리량과 짧은 대기 시간 제공이 가능합니다. 
                                            이는 네트워크 연결 스토리지(NAS)는 제공할 수 없는 수준입니다.

                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            데이터 인식 인텔리전스
                                        </h4>
                                        <p><em>
                                            Spectrum Scale을 통해 스토리지 인프라를 확장하고 공유할 뿐 아니라 
                                            자동으로 파일 및 오브젝트 데이터를 최적의 스토리지 계층에 
                                            최대한 빨리 이동시킬 수 있습니다.
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            글로벌 협업 지원
                                        </h4>
                                        <p><em>
                                            글로벌하게 에지에서 데이터 센터, 클라우드로 애플리케이션을 
                                            가속화할 수 있도록 스토리지와 위치를 포괄하는 
                                            전지역 데이터 액세스가 가능하도록 합니다.
                                        </em></p>
                                    </li>
                                    <li>
                                        <h4>
                                            데이터 무결성 및 보안
                                        </h4>
                                        <p><em>
                                            인증, 암호화, 보안, 이레이저 코딩(erasure coding) 및 복제 옵션을 
                                            사용하여 비즈니스 및 규정 요구사항을 준수합니다.
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
                                            고성능 엔터프라이즈 
                                            스토리지
                                        </strong></h4>
                                    </dt>
                                    <dd><p>Red Hat OpenShift 하이브리드 클라우드 애플리케이션</p></dd>
                                    <dd><p>AI 및 ML 워크로드와 분석</p></dd>
                                    <dd><p>HPC 및 고성능 워크로드</p></dd>
                                    <dd><p>성능이 중요한 경우의 엔터프라이즈 협업</p></dd>
                                    <dd><p>고성능 비디오, IoT 또는 디지털 데이터 액세스</p></dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <h4><strong>
                                            유연한 구성 요소
                                            (에지, 코어, 클라우드)
                                        </strong></h4>
                                    </dt>
                                    <dd><p>IBM NVMe 플래시 노드</p></dd>
                                    <dd><p>Red Hat OpenShift 노드</p></dd>
                                    <dd><p>퍼블릭 클라우드 노드</p></dd>
                                    <dd><p>용량 노드</p></dd>
                                    <dd><p>오브젝트 스토리지 노드</p></dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <h4><strong>
                                            IBM Spectrum Scale 
                                            엔터프라이즈 데이터 서비스
                                        </strong></h4>
                                    </dt>
                                    <dd><p>스냅샷 및 멀티-사이트 복제</p></dd>
                                    <dd><p>통합 데이터 라이프사이클 관리</p></dd>
                                    <dd><p>암호화 및 WORM 데이터 보안</p></dd>
                                    <dd><p>데이터 배치 최적화 및 데이터 감축</p></dd>
                                    <dd><p>로깅 및 이벤트 알림</p></dd>
                                    <dd><p>데이터 카탈로그와 정책</p></dd>
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