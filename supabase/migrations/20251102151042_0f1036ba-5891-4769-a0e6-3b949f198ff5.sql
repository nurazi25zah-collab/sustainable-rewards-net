-- Create enum types
CREATE TYPE status_verifikasi AS ENUM ('menunggu', 'disetujui', 'ditolak');
CREATE TYPE status_penukaran AS ENUM ('menunggu', 'disetujui', 'ditolak', 'kadaluarsa');
CREATE TYPE jenis_transaksi AS ENUM ('setoran', 'penukaran');
CREATE TYPE tipe_notifikasi AS ENUM ('setoran', 'penukaran', 'sistem', 'info');
CREATE TYPE app_role AS ENUM ('admin', 'petugas', 'warga');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create WARGA table (profiles)
CREATE TABLE public.warga (
  warga_id CHAR(10) PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  no_hp VARCHAR(15),
  alamat TEXT,
  foto_profil VARCHAR(100),
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create MERCHANT table
CREATE TABLE public.merchant (
  merchant_id CHAR(10) PRIMARY KEY,
  nama_merchant VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  logo VARCHAR(100),
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create KATEGORI_SAMPAH table
CREATE TABLE public.kategori_sampah (
  kategori_id CHAR(5) PRIMARY KEY,
  nama VARCHAR(50) NOT NULL,
  deskripsi TEXT,
  satuan VARCHAR(10) DEFAULT 'kg',
  poin_per_satuan DECIMAL(10,2) NOT NULL,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create TRANSAKSI_SETORAN table
CREATE TABLE public.transaksi_setoran (
  transaksi_id CHAR(10) PRIMARY KEY,
  warga_id CHAR(10) REFERENCES public.warga(warga_id) ON DELETE CASCADE NOT NULL,
  kode_transaksi VARCHAR(20) UNIQUE NOT NULL,
  total_berat DECIMAL(10,2) DEFAULT 0,
  total_poin DECIMAL(10,2) DEFAULT 0,
  alamat_pikup TEXT,
  status_verifikasi status_verifikasi DEFAULT 'menunggu',
  tanggal_setor TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  catatan_petugas TEXT,
  tanggapan_foto_evidence VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create DETAIL_SETORAN_ITEM table
CREATE TABLE public.detail_setoran_item (
  detail_id CHAR(10) PRIMARY KEY,
  transaksi_id CHAR(10) REFERENCES public.transaksi_setoran(transaksi_id) ON DELETE CASCADE NOT NULL,
  kategori_id CHAR(5) REFERENCES public.kategori_sampah(kategori_id) ON DELETE RESTRICT NOT NULL,
  berat_per_item DECIMAL(10,2) NOT NULL,
  poin_awal DECIMAL(10,2) NOT NULL,
  poin_final DECIMAL(10,2),
  waktu_verifikasi TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create SALDO_POIN table
CREATE TABLE public.saldo_poin (
  user_id CHAR(10) PRIMARY KEY REFERENCES public.warga(warga_id) ON DELETE CASCADE,
  total_poin DECIMAL(10,2) DEFAULT 0,
  poin_dipakai_kumulatif DECIMAL(10,2) DEFAULT 0,
  poin_terkumpul_kumulatif DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create REWARD table
CREATE TABLE public.reward (
  reward_id CHAR(10) PRIMARY KEY,
  merchant_id CHAR(10) REFERENCES public.merchant(merchant_id) ON DELETE CASCADE NOT NULL,
  nama_reward VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  jumlah_poin DECIMAL(10,2) NOT NULL,
  stok_reward INT DEFAULT 0,
  masa_berlaku DATE,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create TRANSAKSI_PENUKARAN table
CREATE TABLE public.transaksi_penukaran (
  penukaran_id CHAR(10) PRIMARY KEY,
  user_id CHAR(10) REFERENCES public.warga(warga_id) ON DELETE CASCADE NOT NULL,
  reward_id CHAR(10) REFERENCES public.reward(reward_id) ON DELETE RESTRICT NOT NULL,
  poin_rancangan DECIMAL(10,2) NOT NULL,
  status_penukaran status_penukaran DEFAULT 'menunggu',
  tgl_penukaran TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tgl_kedaluwarsa DATE,
  catatan_admin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create HISTORI_POIN_NILAI table
CREATE TABLE public.histori_poin_nilai (
  histori_id CHAR(10) PRIMARY KEY,
  user_id CHAR(10) REFERENCES public.warga(warga_id) ON DELETE CASCADE NOT NULL,
  transaksi_id CHAR(10) REFERENCES public.transaksi_setoran(transaksi_id) ON DELETE SET NULL,
  penukaran_id CHAR(10) REFERENCES public.transaksi_penukaran(penukaran_id) ON DELETE SET NULL,
  jenis_transaksi jenis_transaksi NOT NULL,
  jumlah_poin DECIMAL(10,2) NOT NULL,
  saldo_sebelum DECIMAL(10,2) NOT NULL,
  saldo_sesudah DECIMAL(10,2) NOT NULL,
  keterangan VARCHAR(150),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create EDUKASI table
CREATE TABLE public.edukasi (
  edukasi_id CHAR(10) PRIMARY KEY,
  judul VARCHAR(200) NOT NULL,
  konten TEXT NOT NULL,
  kategori VARCHAR(50),
  penulis VARCHAR(50),
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create NOTIFIKASI table
CREATE TABLE public.notifikasi (
  notifikasi_id CHAR(10) PRIMARY KEY,
  user_id CHAR(10) REFERENCES public.warga(warga_id) ON DELETE CASCADE NOT NULL,
  judul VARCHAR(100) NOT NULL,
  pesan TEXT NOT NULL,
  tipe tipe_notifikasi NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategori_sampah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi_setoran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detail_setoran_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saldo_poin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi_penukaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.histori_poin_nilai ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edukasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifikasi ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for warga
CREATE POLICY "Users can view their own profile" ON public.warga
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.warga
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins and Petugas can view all profiles" ON public.warga
  FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'petugas')
  );

-- RLS Policies for merchant (public read, admin write)
CREATE POLICY "Anyone can view active merchants" ON public.merchant
  FOR SELECT USING (status_aktif = true);

CREATE POLICY "Admins can manage merchants" ON public.merchant
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for kategori_sampah (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON public.kategori_sampah
  FOR SELECT USING (status_aktif = true);

CREATE POLICY "Admins can manage categories" ON public.kategori_sampah
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for transaksi_setoran
CREATE POLICY "Warga can view their own transactions" ON public.transaksi_setoran
  FOR SELECT USING (
    warga_id IN (SELECT warga_id FROM public.warga WHERE user_id = auth.uid())
  );

CREATE POLICY "Warga can insert their own transactions" ON public.transaksi_setoran
  FOR INSERT WITH CHECK (
    warga_id IN (SELECT warga_id FROM public.warga WHERE user_id = auth.uid())
  );

CREATE POLICY "Petugas and Admin can view all transactions" ON public.transaksi_setoran
  FOR SELECT USING (
    public.has_role(auth.uid(), 'petugas') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Petugas and Admin can update transactions" ON public.transaksi_setoran
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'petugas') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for detail_setoran_item
CREATE POLICY "Users can view their transaction details" ON public.detail_setoran_item
  FOR SELECT USING (
    transaksi_id IN (
      SELECT transaksi_id FROM public.transaksi_setoran 
      WHERE warga_id IN (SELECT warga_id FROM public.warga WHERE user_id = auth.uid())
    ) OR
    public.has_role(auth.uid(), 'petugas') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Warga can insert their transaction details" ON public.detail_setoran_item
  FOR INSERT WITH CHECK (
    transaksi_id IN (
      SELECT transaksi_id FROM public.transaksi_setoran 
      WHERE warga_id IN (SELECT warga_id FROM public.warga WHERE user_id = auth.uid())
    )
  );

-- RLS Policies for saldo_poin
CREATE POLICY "Users can view their own balance" ON public.saldo_poin
  FOR SELECT USING (
    user_id IN (SELECT warga_id FROM public.warga WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can view all balances" ON public.saldo_poin
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for reward (public read, admin write)
CREATE POLICY "Anyone can view active rewards" ON public.reward
  FOR SELECT USING (status_aktif = true);

CREATE POLICY "Admins can manage rewards" ON public.reward
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for transaksi_penukaran
CREATE POLICY "Users can view their own redemptions" ON public.transaksi_penukaran
  FOR SELECT USING (
    user_id IN (SELECT warga_id FROM public.warga WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert their own redemptions" ON public.transaksi_penukaran
  FOR INSERT WITH CHECK (
    user_id IN (SELECT warga_id FROM public.warga WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all redemptions" ON public.transaksi_penukaran
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for histori_poin_nilai
CREATE POLICY "Users can view their own history" ON public.histori_poin_nilai
  FOR SELECT USING (
    user_id IN (SELECT warga_id FROM public.warga WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can view all history" ON public.histori_poin_nilai
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for edukasi (public read, admin write)
CREATE POLICY "Anyone can view active education content" ON public.edukasi
  FOR SELECT USING (status_aktif = true);

CREATE POLICY "Admins can manage education content" ON public.edukasi
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for notifikasi
CREATE POLICY "Users can view their own notifications" ON public.notifikasi
  FOR SELECT USING (
    user_id IN (SELECT warga_id FROM public.warga WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their own notifications" ON public.notifikasi
  FOR UPDATE USING (
    user_id IN (SELECT warga_id FROM public.warga WHERE user_id = auth.uid())
  );

-- Trigger function to create warga profile and role after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_warga_id CHAR(10);
BEGIN
  -- Generate warga_id
  new_warga_id := 'W' || LPAD(FLOOR(RANDOM() * 999999999)::TEXT, 9, '0');
  
  -- Insert into warga table
  INSERT INTO public.warga (warga_id, user_id, nama_lengkap, email)
  VALUES (
    new_warga_id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama_lengkap', NEW.email),
    NEW.email
  );
  
  -- Assign 'warga' role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'warga');
  
  -- Create initial saldo_poin entry
  INSERT INTO public.saldo_poin (user_id)
  VALUES (new_warga_id);
  
  RETURN NEW;
END;
$$;

-- Trigger to call handle_new_user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update saldo_poin
CREATE OR REPLACE FUNCTION public.update_saldo_after_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME = 'histori_poin_nilai' THEN
    UPDATE public.saldo_poin
    SET 
      total_poin = NEW.saldo_sesudah,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for updating saldo
CREATE TRIGGER after_histori_insert
  AFTER INSERT ON public.histori_poin_nilai
  FOR EACH ROW EXECUTE FUNCTION public.update_saldo_after_transaction();