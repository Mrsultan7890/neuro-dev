# Google Ads Setup Guide

## Google AdSense Code Placement

Aapko sirf Google AdSense ka code copy kar ke paste karna hai:

### Step 1: Google AdSense Account
1. Google AdSense account banaye
2. Website add kariye
3. Ad unit create kariye

### Step 2: Code Placement
Har page mein `<!-- Google AdSense code yahan paste kariye -->` comment ke jagah aapka AdSense code paste kariye:

**Files to update:**
- index.html
- course.html  
- videos.html
- donate.html

### Step 3: Ad Sizes
- **Desktop**: 728x90 (Leaderboard)
- **Mobile**: 320x50 (Mobile Banner)

### Example Code Structure:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### Features:
✅ Bottom placement - site design pe koi effect nahi
✅ Responsive ads - mobile aur desktop dono ke liye
✅ CSP headers updated - Google Ads domains allowed
✅ Clean styling - site theme ke saath match karta hai

### Note:
Ads sirf bottom mein lagenge taki user experience disturb na ho aur content properly readable rahe.