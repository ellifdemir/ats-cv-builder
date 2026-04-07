# ATS Uyumlu CV Oluşturucu

Bu proje, kullanıcıların tek sütunlu ve ATS uyumlu bir CV’yi form üzerinden doldurup canlı önizleme ile görmesini; ardından PDF veya Word olarak indirmesini sağlar.

## Önemli: Veri Saklama Yok

- Uygulama herhangi bir veritabanına, sunucuya veya dosyaya veri kaydetmez.
- Girilen bilgiler sadece tarayıcıda, sayfa açıkken ekranda görünür (uygulama state’i).
- Sayfayı yenilediğinizde (F5 / refresh), tarayıcı sekmesini kapatıp açtığınızda veya uygulamayı yeniden başlattığınızda girilen bilgiler silinir.
- Bu yüzden “site verileri tutmuyor” gibi görünür; mevcut tasarım gereği kalıcı kayıt yoktur.

## İndirme Davranışı

- PDF İndir: CV’yi seçilebilir metin içeren PDF olarak üretir.
- Word İndir: CV’yi Word’ün açabileceği .doc formatında indirir.
- İndirdiğiniz dosya oluşturulduktan sonra uygulama içinde veriler yine sadece ekranda kalır; refresh sonrası geri gelmez.

## Çalıştırma

```powershell
cd c:\Users\kullanıcı\Desktop\proje_dosya_adı
npm install
npm run dev
```

Tarayıcıdan açın:

- http://127.0.0.1:5173/


## Arayüz

![](<Ekran görüntüsü 2026-04-07 141713.png>)

![](<Ekran görüntüsü 2026-04-07 141749.png>)

![](<Ekran görüntüsü 2026-04-07 141808.png>)

## PDF Çıktısı

![](<Ekran görüntüsü 2026-04-07 142602.png>)