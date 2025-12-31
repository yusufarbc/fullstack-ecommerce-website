-- CreateEnum
CREATE TYPE "SiparisDurumu" AS ENUM ('BEKLEMEDE', 'HAZIRLANIYOR', 'KARGOLANDI', 'TESLIM_EDILDI', 'TAMAMLANDI', 'IPTAL_EDILDI');

-- CreateEnum
CREATE TYPE "FaturaDurumu" AS ENUM ('DUZENLENMEDI', 'DUZENLENDI', 'ODENDI');

-- CreateTable
CREATE TABLE "urunler" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "fiyat" DECIMAL(65,30) NOT NULL,
    "desi" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "aciklama" TEXT,
    "resimUrl" TEXT,
    "kategoriId" TEXT,
    "olusturulmaTarihi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellenmeTarihi" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "urunler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategoriler" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "olusturulmaTarihi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellenmeTarihi" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategoriler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siparisler" (
    "id" TEXT NOT NULL,
    "toplamTutar" DECIMAL(65,30) NOT NULL,
    "kargoUcreti" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "durum" "SiparisDurumu" NOT NULL DEFAULT 'BEKLEMEDE',
    "faturaDurumu" "FaturaDurumu" NOT NULL DEFAULT 'DUZENLENMEDI',
    "eposta" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "soyad" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "siparisNumarasi" TEXT NOT NULL,
    "takipTokeni" TEXT,
    "adres" TEXT NOT NULL,
    "sehir" TEXT NOT NULL,
    "ilce" TEXT NOT NULL,
    "postaKodu" TEXT NOT NULL,
    "ulke" TEXT NOT NULL DEFAULT 'Türkiye',
    "kurumsalMi" BOOLEAN NOT NULL DEFAULT false,
    "sirketAdi" TEXT,
    "vergiDairesi" TEXT,
    "vergiNumarasi" TEXT,
    "odemeId" TEXT,
    "odemeTokeni" TEXT,
    "odemeDurumu" TEXT DEFAULT 'PENDING',
    "olusturulmaTarihi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellenmeTarihi" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siparisler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siparis_kalemleri" (
    "id" TEXT NOT NULL,
    "siparisId" TEXT NOT NULL,
    "urunId" TEXT NOT NULL,
    "adet" INTEGER NOT NULL,
    "fiyat" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "siparis_kalemleri_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kategoriler_ad_key" ON "kategoriler"("ad");

-- CreateIndex
CREATE UNIQUE INDEX "siparisler_siparisNumarasi_key" ON "siparisler"("siparisNumarasi");

-- CreateIndex
CREATE UNIQUE INDEX "siparisler_takipTokeni_key" ON "siparisler"("takipTokeni");

-- CreateIndex
CREATE UNIQUE INDEX "siparisler_odemeTokeni_key" ON "siparisler"("odemeTokeni");

-- AddForeignKey
ALTER TABLE "urunler" ADD CONSTRAINT "urunler_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "kategoriler"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siparis_kalemleri" ADD CONSTRAINT "siparis_kalemleri_siparisId_fkey" FOREIGN KEY ("siparisId") REFERENCES "siparisler"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siparis_kalemleri" ADD CONSTRAINT "siparis_kalemleri_urunId_fkey" FOREIGN KEY ("urunId") REFERENCES "urunler"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
