# Filter Periode Documentation

## 🎯 Overview

Fitur filter periode telah ditambahkan ke komponen LK untuk membatasi data yang ditampilkan berdasarkan periode laporan.

## 📋 Periode yang Tersedia

| Kode | Nama Periode | Deskripsi                   |
| ---- | ------------ | --------------------------- |
| 01   | Bulanan      | Laporan per bulan (Default) |
| 02   | Semesteran   | Laporan per semester        |
| 03   | Tahunan      | Laporan per tahun           |
| 04   | TW-3         | Laporan triwulan 3          |

## ✨ Fitur Filter

### 1. **Default Periode**

- Filter dimulai dengan periode "01" (Bulanan)
- Data otomatis di-filter saat komponen pertama kali dimuat

### 2. **Dynamic Filtering**

- Query SQL otomatis diupdate dengan kondisi: `and a.periode='${selectedPeriode}'`
- Data ter-refresh secara real-time saat filter berubah

### 3. **User Interface**

```jsx
// Filter dropdown dengan loading indicator
<Form.Select
  value={selectedPeriode}
  onChange={handlePeriodeChange}
  disabled={loading}
>
  {periodeOptions.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</Form.Select>
```

### 4. **Visual Indicators**

- **Header tabel**: Menampilkan filter aktif
- **Counter**: Total data yang ditampilkan
- **Loading**: Spinner saat memuat data
- **Empty state**: Pesan khusus jika tidak ada data

## 🎨 UI Components

### Filter Header

```jsx
<Row className="align-items-center">
  <Col md={6}>
    <h5>Data Laporan LK</h5>
    <small>Klik icon download di kolom Opsi untuk mengunduh file</small>
  </Col>
  <Col md={6}>
    <Form.Group>
      <Form.Label>Filter Periode:</Form.Label>
      <Form.Select value={selectedPeriode} onChange={handlePeriodeChange}>
        {/* Options */}
      </Form.Select>
    </Form.Group>
    <div>Total: {data.length} data</div>
  </Col>
</Row>
```

### Reset Button

- Muncul hanya jika filter bukan "01" (Bulanan)
- One-click reset ke periode default

### Empty State

- Icon inbox yang menarik
- Pesan informatif sesuai filter aktif
- Tombol reset untuk kemudahan

## 🔧 Technical Implementation

### State Management

```javascript
const [selectedPeriode, setSelectedPeriode] = useState("01");

const periodeOptions = [
  { value: "01", label: "Bulanan" },
  { value: "02", label: "Semesteran" },
  { value: "03", label: "Tahunan" },
  { value: "04", label: "TW-3" },
];
```

### Query Modification

```sql
-- Query sebelum
WHERE a.jenis='01' ${filterKppn}

-- Query sesudah
WHERE a.jenis='01' AND a.periode='${selectedPeriode}' ${filterKppn}
```

### Effect Dependencies

```javascript
useEffect(() => {
  cek && getData();
}, [cek, selectedPeriode]); // Trigger re-fetch saat periode berubah
```

## 🚀 Benefits

### 1. **Performance**

- Mengurangi data yang dimuat dari database
- Loading lebih cepat dengan dataset yang lebih kecil
- Mengurangi memory usage di browser

### 2. **User Experience**

- Data lebih fokus dan relevan
- Interface yang lebih clean
- Navigation yang mudah antar periode

### 3. **Scalability**

- Mudah menambah periode baru
- Filter dapat dikombinasi dengan filter lain
- Struktur yang reusable

## 📱 Responsive Design

### Desktop

- Filter di sebelah kanan header
- Layout horizontal dengan spacing optimal

### Mobile

- Stack vertical saat layar kecil
- Bootstrap responsive grid

## 🎭 User Interactions

### Filter Change Flow

1. User memilih periode dari dropdown
2. Loading indicator muncul
3. Notifikasi konfirmasi perubahan filter
4. Data ter-refresh otomatis
5. Counter dan header terupdate

### Reset Flow

1. User klik tombol Reset (jika tersedia)
2. Filter kembali ke "01" (Bulanan)
3. Notifikasi konfirmasi reset
4. Data ter-refresh dengan filter default

## 🎯 Future Enhancements

### Possible Improvements

- [ ] Multi-select periode
- [ ] Date range picker
- [ ] Save user preferences
- [ ] Export filtered data
- [ ] Advanced filtering (by KPPN, tahun, etc.)

## 🐛 Error Handling

### No Data Scenario

- Informative empty state
- Helpful messaging
- Quick reset option

### Loading States

- Disabled controls during loading
- Visual loading indicators
- Smooth transitions

## 📊 Impact Analysis

### Before Filter

- Semua data periode dimuat sekaligus
- Potensi performance issue dengan data besar
- Scroll panjang untuk mencari data spesifik

### After Filter

- ✅ Data terfokus per periode
- ✅ Loading lebih cepat
- ✅ User experience lebih baik
- ✅ Scalable untuk data besar
