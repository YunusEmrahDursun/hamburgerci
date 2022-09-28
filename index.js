<html>
    <head></head>
    <body>
        <div id="log"></div>
        <div id="menu"></div>
        <div id="mood" hidden>
            <input type="radio" id="r1" name="level" value="2"> Az pişmiş
            <input type="radio" id="r2" name="level" value="3"> Orta pişmiş
            <input type="radio" id="r3" name="level" value="4" > iyi pişmiş
        </div>
        <button onclick="siparisAlma()">Hazırla</button>
    </body>
</html>
<script>
    //  önemli: bu proje için kendi isteğime bağlı olarak hiç bir kütüphane kullanmadım.

    const menuElement=document.getElementById("menu");
    let siparisVarmi=false;
    let stok=
    {
        "Marul":5,
        "Turşu":5,
        "Paket_Sos":5,
        "Soğan":5,
        "Köfte":5,
        "Tavuk":5,
        "Domates":5,
        "Ekmek":5,
        "Patates":5,
        "Cola":5,

    }
    // menuye yeni ürün geldiğinde buraya ekle
    const menu=["Paket_Sos","Köfte","Tavuk","Patates","Cola"]

    //inputları oluşturur
    menuElement.innerHTML=menu.map(key=> `<input type="number" placeholder="${key.replace("_"," ")}"  name="${key}">`).join("")
    
    //main
    let siparis={};
    let gerekenMalzemeler;
    let pismeSuresi=0;
    async function siparisAlma(){
        siparisVarmi=true;

        log("Sipariş alınıyor..");
        await delay(1);
        menuElement.querySelectorAll("input").forEach(x=> x.value && (siparis[x.getAttribute("name")]=x.value) );

        log("Stok Kontrolü yapılıyor");
        await delay(3);
        //malzemeleri başlangıçta 0 olarak ayarladık
        gerekenMalzemeler= Object.keys(stok).reduce((obj,key) =>  { 
            obj[key] = 0;
            return obj;
        }, {});

        Object.keys(stok).map(key=>{
            //tariflerimize burda mudahele ediyoruz
            if(key=="Tavuk" || key=="Köfte"){
                gerekenMalzemeler["Marul"]++;
                gerekenMalzemeler["Turşu"]++;
                gerekenMalzemeler["Soğan"]++;
                gerekenMalzemeler["Domates"]++;
                gerekenMalzemeler["Ekmek"]++;
            }
            // köfte veya tavuğunda eklenmesi lazım o yüzden else kullanmadık
            gerekenMalzemeler[key]++;
        })

        //stok kontrolü zamanı
        if(Object.keys(gerekenMalzemeler).find(key=> stok[key]<siparis[key] )) {
            log("Üzgünüz. Siparişiniz için yeterli ürünümüz kalmadı.");
            return;
        }

        //sipraiş köfte içeriyorsa pişme derecelerini sormalıyız
        //if(siparis["Tavuk"] || siparis["Köfte"]){ çiğ tavuk zehirler ondan yok :)
        if( siparis["Köfte"] ){
            log("Lütfen pişme derecelerini seçiniz");
            await delay(1);
            document.getElementById("mood").style.display= "block";
        }
        else{
            siparisHazirlama()
        }

    }
    document.querySelectorAll("#mood>input").forEach(x=>{
        x.addEventListener('click', function (event) {
            if(siparisVarmi){
                pismeSuresi=event.target.value
                document.getElementById("mood").style.display= "none";
                siparisHazirlama()
            }
        });
    })

    //hazirlama aşaması
    async function siparisHazirlama(){
        log("Hazırlanılıyor..");
        let hazırlanıcaklar=[];
        if(siparis["Tavuk"]){
            hazırlanıcaklar.push(delay(3))
        }
        if( pismeSuresi ){
            hazırlanıcaklar.push(delay(pismeSuresi))
        }
        if(siparis["Patates"]){
            hazırlanıcaklar.push(delay(5))
        }
        if(siparis["Cola"]){
            hazırlanıcaklar.push(delay(2))
        }
        await Promise.all(hazırlanıcaklar)
        //buraya hamburger sayısı kadar bekleme koyulabilinir
        //await delay( (siparis["Tavuk"]+siparis["Köfte"])*2 )
        log("Tepsiye konuluyor");
        await delay(1)
        log("Buyrun.");
        await delay(1)

        //stoğu azaltalım
        for ( key in gerekenMalzemeler) {
            stok[key]=stok[key]-gerekenMalzemeler[key];
        }
    }

    
    //müşterileri bilgilendirmek için kullanılan log
    function log(txt){
        document.getElementById("log").innerText=txt;
    }
  


    //bellirli süre bekletme işlemi
    async function delay(sec){
        return new Promise(function(resolve, reject){
            let timer=0;
            console.log(sec);
            var customInterval=setInterval(function(){
                timer++;
                console.log(sec-timer);
                if(timer>=sec ){
                    clearInterval(customInterval);
                    resolve();
                }
            },1000)
        })
    }

</script>

