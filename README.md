# Uçtan Uca Test

Bir proje yaratalım ng new e2e-project ile. Biraz environment dosyalarını inceleyelim. Normalde sistem ortam değişkenlerini (system environment) kullanabiliyorduk angular 5 mi 6 mı bilemedim. Ama sonrasında environment.prod.ts ve diğer ortam dosyalarıyla bu ihtiyacımızı görür hale geldik. Peki environment.**.ts dosyası nasıl aktif ediliyor?

`ng build|serve --help` yapıp `--configuration` anahtarının ne yaptığına bakalım:
![image](https://user-images.githubusercontent.com/261946/99897553-6c200680-2cab-11eb-9907-b8230c03cbe1.png)

```
ng build|serve --prod 
veya
ng build|serve --configuration=production
```

Ön tanımlı olarak --prod geliyor. Angular projesinin çalıştırılması için önce yapılandırılması (build) gerekir. Sonrasında sunulması (serve) ile projeyi internet gezgininde görebiliriz. Projenin yapılandırılması için (build) ayarlarımızı angular.json içinde aşağıdaki
```
"projects": {
  .."e2e-project": {
  ...."architect": {
  ......"build": {
  ........"options": {
  ................. tüm konfigürasyonlar için yapılandırma ayarları
  ........},
  ........"configurations": { 
  .........."production": {
  .................. -c=--prod uygulamayı canlıya çıkarma ayarlar
  ..........},
  .........."dev": {
  .................. -c=--dev yapılandırmanın geliştirme ayarları
  ..........},
  .........."e2e": {
  .................. -c=--e2e uygulamayı uçtan uca çıkarma ayarları
  ..........},
  ```
build altında varsayılan olarak production (`--prod`) geliyor malûmumuz. İçeriğine bakarsak:
typescript olarak kodlanmış projemizi outputPath ile hangi dizine (`/dist/proje_adı`) javascript kodları olarak çıkaracağını
main ile projenin başlangıç dosyasını (`src/main.ts`)
tsConfig ile Typescript kodlarını Javascript kodlarına dönüştürmenin ayarlarını nereden okuyacağını (tsconfig.app.json)
AheadOfTime kullanıp kullanmayacağını
Her ortama uygun (production, development, e2e test, kullanıcı kabul test, smoke test, benimOzelGelistirmem vs.) yapılandırma (build) ayarlarını configurations içinde belirtebileceğimizi görüyoruz. Biraz daha ayrıntıya bakalım.
![image](https://user-images.githubusercontent.com/261946/99897517-1fd4c680-2cab-11eb-95bc-f803a71d34e0.png)

Şimdi ortama göre özel konfigürasyonları nasıl veriyoruz bakalım:
![image](https://user-images.githubusercontent.com/261946/99897547-5874a000-2cab-11eb-812a-26ea87019df8.png)

production Adıyla tanımlı yapılandırmada fileReplacements içinde 0..* dosya tanımı vererek yer değiştirmelerini sağlayabiliriz. Yukarıdaki ayara göre şu olur:
`src/environments/environment.ts` dosyası olarak `src/environments/environment.prod.ts` dosyasını kullanır. Böylece prod içinde tanımlı ortam değişkenlerini uygulamanızın içinde kullanabiliriz.

Ref: (https://angular.io)[https://angular.io/guide/build#configuring-application-environments]

![image](https://user-images.githubusercontent.com/261946/99897489-edc36480-2caa-11eb-8c05-01d957f79e65.png)
![image](https://user-images.githubusercontent.com/261946/99897464-c5d40100-2caa-11eb-8707-7c571732848c.png)

Özetle; build (inşa) edilirken -c anahtarına verdiğimiz değeri (production) ayarlarda buldu ve içerisindeki yapılandırmaya uygun işler yaparak projeyi derledi (environment.prod.ts dosyasını environment.ts ile değiştirdi vs.). Şimdi bir ayar daha ekleyip tekrar ng serve -c yerel_makinede_gelistirme diyelim. Sözde aynı projeyi, kendi makinamızda geliştirme yaparken farklı, uzakta bir makine üstünde (örn. amazonun bedava verdiği uzak masaüstü yapılabilen makinelerde) farklı ayarlarda çalıştırmak isteyelim. Her makinede veri tabanı sunucusuna ve apiye farklı portlardan erişiyor olalım. Bu bilgiyi her ortam için farklı `port.**.json` dosyalarında tutuyor olalım. Ama önce JSON dosyasını `**.component.ts` dosyamızda kullanabilelim.

### angular'da JSON Dosyalarını Kullanmak
Http ile istek yapabilir, `**.d.ts` dosyası içinde tanımlanıp çekilebilir ama biz şöyle yapalım:

```
import {hede} from '../assets/port.json'
```

Derlerdiğimizde angular bize bir öneriyle hata verecek:

![image](https://user-images.githubusercontent.com/261946/99897452-a341e800-2caa-11eb-8016-21374dc4a054.png)

Angular'a sen .json da bak demek için tsconfig.json da:
`--resolveJsonModule`, .json dosyalarından çekilen tiplerin içe aktarılmasına izin verir.
Bir modülden dışa aktarmak için module.exports.bıdı kullanılır ancak JSON dosyasında böyle bir ihraç olmaz. --esModuleInterop, sayesinde veri varsayılan dışa aktarma olmamasına rağmen varsayılan şekilde içe aktarmalara izin verir. 

```
{
  ...,
  "compilerOptions": {
    ...,
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

![image](https://user-images.githubusercontent.com/261946/99897414-5fe77980-2caa-11eb-9483-076843128093.png)

Şimdi yerel makinede ve uzak makinede çalışırken port bilgilerinin ortamlara göre değişmesi için önce ortamlara göre ayarları ve bu ortamlarda yer değiştirecek dosyaların bilgilerini fileReplacements içinde belirtelim.
Önce çıktılara bakalım sonra ayarlara:

![image](https://user-images.githubusercontent.com/261946/99897388-29a9fa00-2caa-11eb-87ac-e207be6c7c8e.png)
ng serve - configuration=yerel_makinede_gelistirme
![image](https://user-images.githubusercontent.com/261946/99897402-4ba37c80-2caa-11eb-84d2-a1edd54c2206.png)
ng serve - configuration=uzak_makinede_gelistirme

build içinde tanımlı ayarı serve içinde çağırıyoruz. ng build|serve -c xxx komutundaki xxx yerine ayar tanımında kullandığımız alan adını kullanıyoruz.

![image](https://user-images.githubusercontent.com/261946/99897378-10a14900-2caa-11eb-8cb8-209f3f6b869a.png)
![image](https://user-images.githubusercontent.com/261946/99897366-e8194f00-2ca9-11eb-8d30-e088cdf0c96f.png)
