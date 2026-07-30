if(innerWidth >= 1024){
  $(window).on("scroll", function () {
    var sTop = $(this).scrollTop();
      console.log(sTop);
    if (sTop >= (window.innerHeight - 168)) {
      $("header").addClass("t_fixed");
      $(".tab").addClass("t_fixed");
      $(".m_tab").addClass("t_fixed");
      $(".primary").addClass("t_fixed");
      $(".secondary").addClass("t_fixed");
      $(".content_standard").addClass("t_fixed");
    } else if (sTop <= (window.innerHeight - 168)) {
      $("header").removeClass("t_fixed");
      $(".tab").removeClass("t_fixed");
      $(".m_tab").removeClass("t_fixed");
      $(".primary").removeClass("t_fixed");
      $(".secondary").removeClass("t_fixed");
      $(".content_standard").removeClass("t_fixed");
    }
  });
} else if(innerWidth < 1024){
  $(window).on("scroll", function () {
    var sTop = $(this).scrollTop();
      //console.log(sTop);
    if (sTop >= (window.innerHeight - 150)) {
      $("header").addClass("t_fixed");
      $(".tab").addClass("t_fixed");
      $(".m_tab").addClass("t_fixed");
      $(".primary").addClass("t_fixed");
      $(".secondary").addClass("t_fixed");
      $(".content_standard").addClass("t_fixed");
    } else if (sTop <= (window.innerHeight - 150)) {
      $("header").removeClass("t_fixed");
      $(".tab").removeClass("t_fixed");
      $(".m_tab").removeClass("t_fixed");
      $(".primary").removeClass("t_fixed");
      $(".secondary").removeClass("t_fixed");
      $(".content_standard").removeClass("t_fixed");
    }
  });
};

// }