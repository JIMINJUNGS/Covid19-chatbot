const Timer = java.lang.Timer;
const TimerTask = java.lang.TimerTask;
const Jsoup = org.jsoup.Jsoup;

let process = null;

let last_died = null;
let last_p = null;
let last_c = null;

let isRunning = false;
init = args => {
   process = new Timer();
   process.scheduleAtFixedRate(new TimerTask({
      run: function() {
        isRunning = true;
        if(!isRunning) return;
        if(last_died==null||last_c==null||last_p==null) {
            let data = Jsoup.connect("http://ncov.mohw.go.kr/").get();
            last_p = data.select("span.num#text").get(0).text();
            last_died = data.select("span.num").get(3).text();

        } else {
            let data = Jsoup.connect("http://ncov.mohw.go.kr/").get();
             if(data.select("span.num#text").get(0).text() != last_p){
                 args.replier.reply("ak", "[!] 코로나19 확진자가 변동되었습니다.\n"+data.select("span.num#text").get(0).text()+"\n"+data.select("span.before").get(0).text());
                 last_p = data.select("span.num#text").get(0).text();
                 last_died = data.select("span.num").get(3).text();
             }
        }
      }
   }
   )
   )
}
response = (args) => {
    if(args.msg == "/off") {
        //process.cancel();
        isRunning = false;
        args.replier.reply("[!] 실시간 감시가 종료됬습니다")
    }
    if(args.msg == "/on") {
        isRunning = true;
        args.replier.reply("[!] 실시간 감시가 시작되었습니다")
    }
    if(!isRunning) {
        init(args);
    }
}