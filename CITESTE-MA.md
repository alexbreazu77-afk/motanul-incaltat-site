# Site Grădinița Motanul Încălțat — cu panou de administrare

## Ce e în acest folder

- `content/` — textele, prețurile, pozele și documentele site-ului. Panoul de administrare modifică doar aceste fișiere.
- `static/uploads/` — pozele și fișierele încărcate.
- `static/admin/` — panoul de administrare (adresa `/admin`).
- `template.html` și `build.js` — designul și programul care construiește site-ul. Nu se modifică din panou.
- `netlify.toml` — setările pentru Netlify.

## Pașii de punere online (o singură dată)

1. **GitHub**: creați un cont pe github.com → „New repository” → nume `motanul-incaltat-site` → „Create repository”.
   Pe pagina nouă apăsați „uploading an existing file” și trageți acolo **tot conținutul** acestui folder
   (folderele `content`, `static` și fișierele `build.js`, `template.html`, `netlify.toml`). Apăsați „Commit changes”.
2. **Netlify**: creați un cont pe netlify.com cu „Sign up with GitHub”.
   „Add new project” → „Import an existing project” → GitHub → alegeți `motanul-incaltat-site` → „Deploy”.
   După ~1 minut site-ul apare la o adresă de forma `ceva.netlify.app`.
3. **Activați autentificarea** (în Netlify, la proiectul creat):
   - „Identity” → „Enable Identity”.
   - La „Registration” alegeți **Invite only** (doar persoanele invitate pot intra în panou).
   - La „Services” → „Git Gateway” → „Enable Git Gateway”.
4. **Invitați administratorii**: „Identity” → „Invite users” → emailul doamnei directoare (și al dumneavoastră).
   Fiecare primește un email, apasă pe link, își alege parola și intră în panou.
5. **Formularele** (programare vizită și sesizări anonime):
   - „Forms” → „Enable form detection”, apoi „Deploys” → „Trigger deploy” → „Deploy site”.
   - „Forms” → „Form notifications” → „Add notification” → „Email notification” → `office@motanulincaltat.com`,
     pentru formularele `programare` și `sesizari`.
6. **Domeniul**: „Domain management” → „Add a domain” → `motanulincaltat.com` și urmați pașii afișați
   (se modifică înregistrările DNS la firma unde e înregistrat domeniul). Atenție: nu ștergeți înregistrările MX,
   altfel emailul grădiniței nu mai funcționează.

## Cum se folosește panoul

- Adresa: `https://adresa-site-ului/admin` → „Login with Netlify Identity” → email și parolă.
- Alegeți pagina (Tarife, Documente publice, Galerie foto, Prima pagină, Despre noi, Informații, Date de contact).
- Modificați textul, adăugați sau ștergeți elemente din liste, încărcați poze sau PDF-uri.
- Apăsați **Publish** (Publică). Site-ul se actualizează singur în aproximativ un minut.
