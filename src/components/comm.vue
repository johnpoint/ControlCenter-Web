<script>

function timeSwitch(s) {
  var yr = "", mon = "", day = "", hr = "", min = "";
  if (s >= (60 * 60 * 24 * 30 * 12)) {
    yr = s / (60 * 60 * 24 * 30 * 12);
    yr = parseInt(yr)
    s -= (yr * (60 * 60 * 24 * 30 * 12))
    yr += " yr "
  }
  if (s >= (60 * 60 * 24 * 30)) {
    mon = s / (60 * 60 * 24 * 30);
    mon = parseInt(mon)
    s -= (mon * (60 * 60 * 24 * 30))
    mon += " mon "
  }
  if (s >= (60 * 60 * 24)) {
    day = s / (60 * 60 * 24);
    day = parseInt(day)
    s -= (day * (60 * 60 * 24))
    day += " day "
  }
  if (s >= (60 * 60)) {
    hr = s / (60 * 60);
    hr = parseInt(hr)
    s -= (hr * (60 * 60))
    hr += " hr "
  }
  if (s >= 60) {
    min = s / 60;
    min = parseInt(min)
    s -= (min * 60)
    min += " min "
  }
  return yr + mon + day + hr + min + s + " s"
}

export default {
  name: "comm",
  timeSwitch,
}
</script>