$(document).ready(function() {
  function zeroFill(number) {
    if (number === 0) {
      return '00';
    } else if (number < 10) {
      number = number.toString();
      return '0' + number;
    }
    return number + ''; // always return a string
  }

  function setColor(color, object) {
    switch (color) {
      case "primary":
        object.removeClass("success warning danger info");
        object.addClass("primary");
        break;
      case "success":
        object.removeClass("primary warning danger info");
        object.addClass("success");
        break;
      case "warning":
        object.removeClass("primary success danger info");
        object.addClass("warning");
        break;
      case "danger":
        object.removeClass("primary success warning info");
        object.addClass("danger");
        break;
      case "info":
        object.removeClass("primary success warning danger");
        object.addClass("info");
        break;
      default:
        console.log("Invalid Color");
        break;
    }
  }

  function renderNumbers(numberData) {
    //Get the DOM Objects
    var upcoming = $(".forecast > .upcoming-shifts > .number");
    var night = $(".forecast > .upcoming-night-shifts > .number");
    var current = $(".forecast > .currently-working > .number");
    var worked = $(".forecast > .hours-worked > .number");

    //Set the Numbers
    upcoming.html(numberData.angelsNeeded);
    night.html(numberData.nightAngelsNeeded);
    current.html(numberData.currentlyWorking);
    worked.html(numberData.hoursWorked);

    //Set the Colors
    if (numberData.angelsNeeded > 9) {
      setColor("danger", upcoming);
    } else if (numberData.angelsNeeded > 0) {
      setColor("warning", upcoming);
    } else {
      setColor("success", upcoming);
    }

    if (numberData.nightAngelsNeeded > 9) {
      setColor("danger", night);
    } else if (numberData.nightAngelsNeeded > 0) {
      setColor("warning", night);
    } else {
      setColor("success", night);
    }
  }

  function renderShifts(data) {
    var nowShiftContainer = $(".job-list > .jobs-now");
    var soonShiftContainer = $(".job-list > .jobs-soon");

    nowShiftContainer.empty();
    $.each(data.nowShifts, function(i, shift) {
      nowShiftContainer.append(generateShiftDOM(shift));
    });
    soonShiftContainer.empty();
    $.each(data.soonShifts, function(i, shift) {
      soonShiftContainer.append(generateShiftDOM(shift));
    });
  }

  function generateShiftDOM(shift) {
    var article = $("<article>");
    article.addClass("job well");
    var header = $("<header>");
    var headerParagraph = $("<p>");
    $.each(shift.angelsNeeded, function(i, angel) {
      if (angel.count > 0) {
        headerParagraph.append(angel.count);
        headerParagraph.append($("<i>").addClass("icon-" + angel.angeltype));
      }
    });

    var start = new Date(shift.start);
    var end = new Date(shift.end);

    var time = $('<time>').addClass("icon-clock");

    time.append(zeroFill(start.getHours()) + ":" + zeroFill(start.getMinutes()));
    time.append("&ndash;");
    time.append(zeroFill(end.getHours()) + ":" + zeroFill(end.getMinutes()));

    headerParagraph.append(time);

    var location = $('<span>').addClass('location icon-location');
    location.append(shift.location);
    headerParagraph.append(location);

    header.append(headerParagraph);
    article.append(header);

    var description = $('<p>').addClass('job-description');
    description.append(shift.title);
    article.append(description);

    if (shift.totalAngelsNeeded > 4) {
      setColor("danger", article);
    } else if (shift.totalAngelsNeeded > 1) {
      setColor("warning", article);
    }

    return article;
  }

  function renderMessages(data) {

  }

  function renderNews(data) {
    var newsContainer = $("section.news");
    newsContainer.empty();
    $.each(data, function(i, news) {
      var n = $("<div>").addClass("news-item");
      n.append($("<h1>").html(news.title));
      n.append($("<p>").html(news.text));
      newsContainer.append(n);
    });
  }

  function renderSchedule(data) {
    var nowTalkContainer = $('.current-talks > ul');
    var soonTalkContainer = $('.next-talks > ul');

    nowTalkContainer.empty();
    $.each(data, function(i, talk) {
      console.log(talk);
      nowTalkContainer.append(generateTalkDOM(talk));
    });

    // soonTalkContainer.empty();
    // $.each(data.soonTalks, function(i, talk) {
    //   soonTalkContainer.append(generateTalkDOM(talk));
    // });
  }

  function generateTalkDOM(talk) {
    var t = $('<li>');
    var time = $('<time>').addClass('icon-clock');

    var start = new Date(talk.start);
    var end = new Date(talk.end);

    time.append(zeroFill(start.getHours()) + ":" + zeroFill(start.getMinutes()));
    time.append("&ndash;");
    time.append(zeroFill(end.getHours()) + ":" + zeroFill(end.getMinutes()));

    t.append(time);

    t.append($('<span>').addClass('location icon-location').html(talk.location));
    t.append($('<span>').addClass('title').html(talk.title));
    return t;
  }
  // < li class = "success" >
  // < time class = "icon-clock" > 18: 00 & ndash;  19: 30 < /time>
  // <span class="location icon-location">Saal 3</span > < span class = "title" > Extreme Photograpy < /span>
  // </li >



  var socket = io.connect('http://hub.chaos-angel.at');

  socket.on('jobUpdate', function(data) {
    renderShifts(data);
  });

  socket.on('newsUpdate', function(data) {
    renderNews(data);
  });

  socket.on('scheduleUpdate', function(data) {
    renderSchedule(data);
  });

  socket.on('numberUpdate', function(data) {
    renderNumbers(data);
  });
});
