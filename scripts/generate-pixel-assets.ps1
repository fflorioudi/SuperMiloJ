Add-Type -AssemblyName System.Drawing

$artDir = Join-Path (Get-Location) "public\art"
New-Item -ItemType Directory -Force -Path $artDir | Out-Null

function Color-Hex($hex) {
  return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function Fill-Rect($g, $hex, $x, $y, $w, $h) {
  $brush = New-Object System.Drawing.SolidBrush (Color-Hex $hex)
  $g.FillRectangle($brush, [int]$x, [int]$y, [int]$w, [int]$h)
  $brush.Dispose()
}

function Fill-Poly($g, $hex, $points) {
  $brush = New-Object System.Drawing.SolidBrush (Color-Hex $hex)
  $pts = $points | ForEach-Object { New-Object System.Drawing.Point ([int]$_[0]), ([int]$_[1]) }
  $g.FillPolygon($brush, [System.Drawing.Point[]]$pts)
  $brush.Dispose()
}

function Fill-Ellipse($g, $hex, $x, $y, $w, $h) {
  $brush = New-Object System.Drawing.SolidBrush (Color-Hex $hex)
  $g.FillEllipse($brush, [int]$x, [int]$y, [int]$w, [int]$h)
  $brush.Dispose()
}

function Draw-Noise($bmp, $seed, $colors) {
  $rand = [System.Random]::new($seed)
  for ($i = 0; $i -lt 520; $i++) {
    $x = $rand.Next(0, $bmp.Width)
    $y = $rand.Next(0, $bmp.Height)
    $c = Color-Hex $colors[$rand.Next(0, $colors.Count)]
    $bmp.SetPixel($x, $y, $c)
  }
}

function Draw-Clouds($g, $seed, $hex) {
  $rand = [System.Random]::new($seed)
  for ($i = 0; $i -lt 7; $i++) {
    $x = $rand.Next(-20, 300)
    $y = $rand.Next(15, 86)
    Fill-Ellipse $g $hex $x $y 32 9
    Fill-Ellipse $g $hex ($x + 18) ($y - 5) 38 13
    Fill-Ellipse $g $hex ($x + 42) $y 34 10
  }
}

function Draw-City($g, $seed, $hex1, $hex2, $baseY) {
  $rand = [System.Random]::new($seed)
  for ($x = -10; $x -lt 340; $x += $rand.Next(18, 34)) {
    $w = $rand.Next(18, 36)
    $h = $rand.Next(34, 98)
    $color = if (($x / 10) % 2 -eq 0) { $hex1 } else { $hex2 }
    Fill-Poly $g $color @(@($x, $baseY), @(($x + 4), ($baseY - $h + 8)), @(($x + $w - 4), ($baseY - $h)), @(($x + $w), $baseY))
  }
}

function Save-Upscaled($small, $path) {
  $large = New-Object System.Drawing.Bitmap 960, 540
  $g2 = [System.Drawing.Graphics]::FromImage($large)
  $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
  $g2.DrawImage($small, 0, 0, 960, 540)
  $large.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g2.Dispose()
  $large.Dispose()
}

function New-Background($index, $file, $skyTop, $skyBottom, $far, $mid, $near, $accent, $kind) {
  $bmp = New-Object System.Drawing.Bitmap 320, 180
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
  for ($y = 0; $y -lt 180; $y++) {
    $t = $y / 179
    $c1 = Color-Hex $skyTop
    $c2 = Color-Hex $skyBottom
    $r = [int]($c1.R + ($c2.R - $c1.R) * $t)
    $gg = [int]($c1.G + ($c2.G - $c1.G) * $t)
    $b = [int]($c1.B + ($c2.B - $c1.B) * $t)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb($r, $gg, $b))
    $g.DrawLine($pen, 0, $y, 320, $y)
    $pen.Dispose()
  }

  Draw-Noise $bmp (1000 + $index) @($accent, $far, "#ffffff")
  Draw-Clouds $g (200 + $index) $far

  switch ($kind) {
    "tutorial" {
      Draw-City $g 31 "#1b2032" "#232947" 122
      Fill-Poly $g $mid @(@(30,124),@(72,92),@(116,125))
      Fill-Ellipse $g $accent 246 36 38 38
      Fill-Rect $g "#e9e2d0" 262 73 9 63
      Fill-Rect $g $near 0 150 320 30
    }
    "skin" {
      Draw-City $g 41 "#20172d" "#2b1c3c" 144
      for ($i=0; $i -lt 7; $i++) {
        $shift = ($i % 2) * 12
        Fill-Poly $g $mid @(@((-30 + $i * 58), (120 + $shift)), @((30 + $i * 58), 106), @((92 + $i * 58), 126), @((44 + $i * 58), 138))
      }
      Fill-Rect $g $near 0 151 320 29
    }
    "patio" {
      Fill-Ellipse $g "#f2d376" 232 28 34 34
      Fill-Poly $g "#8dc1c3" @(@(24,130),@(64,96),@(112,132))
      Fill-Poly $g "#b5484d" @(@(34,102),@(74,82),@(112,104),@(98,124),@(42,126))
      Fill-Rect $g $near 0 150 320 30
    }
    "city" {
      Draw-City $g 52 "#111927" "#182336" 146
      for ($i=0; $i -lt 26; $i++) { Fill-Rect $g $accent ((($i*37)%310)) (64+(($i*19)%70)) 2 3 }
      Fill-Poly $g $near @(@(0,150),@(68,146),@(130,152),@(220,144),@(320,150),@(320,180),@(0,180))
    }
    "sunset" {
      Fill-Ellipse $g "#ffe48a" 226 34 42 42
      Fill-Poly $g "#b9734d" @(@(0,132),@(46,108),@(96,128),@(152,96),@(218,130),@(320,106),@(320,180),@(0,180))
      Fill-Poly $g $near @(@(0,151),@(96,144),@(210,154),@(320,145),@(320,180),@(0,180))
    }
    "road" {
      Fill-Ellipse $g "#ffe189" 240 28 52 52
      Fill-Poly $g $mid @(@(0,138),@(104,112),@(198,134),@(320,102),@(320,180),@(0,180))
      Fill-Poly $g $near @(@(0,156),@(156,142),@(320,158),@(320,180),@(0,180))
    }
    "folklore" {
      Fill-Ellipse $g "#f2d7a2" 242 26 36 36
      Draw-City $g 63 "#182944" "#1f3658" 150
      Fill-Poly $g "#7a583d" @(@(42,142),@(78,110),@(114,142))
      Fill-Rect $g $near 0 152 320 28
    }
    "studio" {
      Draw-City $g 74 "#211b2c" "#30243c" 152
      Fill-Poly $g "#16121e" @(@(36,132),@(62,74),@(118,74),@(144,132))
      for ($i=0; $i -lt 16; $i++) { Fill-Rect $g $accent (50+$i*5) (105-(($i*13)%34)) 2 (28+(($i*7)%38)) }
      Fill-Rect $g $near 0 152 320 28
    }
    "rain" {
      Draw-City $g 85 "#0d2532" "#123644" 150
      for ($i=0; $i -lt 52; $i++) { Fill-Poly $g "#99e8ef" @(@((($i*23)%330), (($i*31)%150)), @(((($i*23)%330)-2), ((($i*31)%150)+9)), @(((($i*23)%330)+1), ((($i*31)%150)+10))) }
      Fill-Poly $g $near @(@(0,153),@(72,148),@(166,155),@(248,149),@(320,153),@(320,180),@(0,180))
    }
    "memory" {
      Draw-City $g 96 "#422b25" "#533a2f" 151
      for ($i=0; $i -lt 6; $i++) {
        $shift = ($i % 2) * 13
        Fill-Poly $g "#e8d7ad" @(@((22 + $i * 50), (65 + $shift)), @((54 + $i * 50), (60 + $shift)), @((60 + $i * 50), (92 + $shift)), @((26 + $i * 50), (98 + $shift)))
      }
      Fill-Rect $g $near 0 152 320 28
    }
    "kitchen" {
      Fill-Poly $g "#261d24" @(@(32,138),@(60,103),@(116,104),@(146,138))
      Fill-Rect $g "#ff7048" 64 95 44 12
      for ($i=0; $i -lt 5; $i++) { Fill-Ellipse $g "#a68b8b" (58+$i*13) (58-$i%2*8) 6 22 }
      Fill-Rect $g $near 0 152 320 28
    }
    "clock" {
      Draw-City $g 117 "#171b2e" "#222844" 151
      Fill-Ellipse $g "#d8d8dc" 228 42 44 44
      Fill-Poly $g $accent @(@(246,64),@(250,65),@(248,78),@(244,78))
      Fill-Rect $g $near 0 152 320 28
    }
    "field" {
      Fill-Rect $g "#77a957" 0 118 320 62
      Fill-Poly $g "#ffffff" @(@(226,104),@(278,104),@(286,142),@(216,142))
      Fill-Rect $g "#ffffff" 240 116 30 3
      Fill-Rect $g $near 0 152 320 28
    }
    "invisible" {
      Draw-City $g 139 "#182118" "#243322" 151
      for ($i=0; $i -lt 10; $i++) { Fill-Ellipse $g "#b9d8c0" (10+$i*34) (70+(($i*17)%55)) 26 8 }
      Fill-Poly $g $near @(@(0,152),@(88,146),@(188,156),@(320,146),@(320,180),@(0,180))
    }
    "fireflies" {
      Draw-City $g 151 "#0a1420" "#142331" 151
      for ($i=0; $i -lt 34; $i++) { Fill-Ellipse $g "#f5ff75" (($i*53)%318) (42+(($i*29)%92)) 2 2 }
      Fill-Poly $g $near @(@(0,153),@(84,143),@(176,156),@(260,146),@(320,152),@(320,180),@(0,180))
    }
    "river" {
      Draw-City $g 162 "#123a4d" "#1f5368" 132
      Fill-Poly $g "#63aac1" @(@(0,126),@(84,118),@(150,130),@(238,118),@(320,126),@(320,180),@(0,180))
      for ($i=0; $i -lt 8; $i++) {
        $shift = ($i % 2) * 8
        Fill-Poly $g "#d6eef2" @(@(($i * 46), (142 + $shift)), @((24 + $i * 46), (139 + $shift)), @((42 + $i * 46), (142 + $shift)), @((22 + $i * 46), (145 + $shift)))
      }
      Fill-Rect $g $near 0 160 320 20
    }
  }

  Save-Upscaled $bmp (Join-Path $artDir $file)
  $g.Dispose()
  $bmp.Dispose()
}

$backgrounds = @(
  @(0, "bg-00-tutorial.png", "#1d2233", "#3f3150", "#4d5f7a", "#694d39", "#5d7f42", "#ffd166", "tutorial"),
  @(1, "bg-01-bajo-de-la-piel.png", "#2f1d4f", "#4a2d68", "#6c5a84", "#34204b", "#6f4a7f", "#f6c45f", "skin"),
  @(2, "bg-02-nino.png", "#78c8d0", "#e8c184", "#a5d8d8", "#d74b4b", "#5d7f42", "#f7da73", "patio"),
  @(3, "bg-03-gil.png", "#18202d", "#263247", "#4a5366", "#1a2534", "#596073", "#e34f5f", "city"),
  @(4, "bg-04-ama-de-mi-sol.png", "#f0a055", "#f6d07c", "#f6c56e", "#8a5140", "#7a5c3e", "#fff3a5", "sunset"),
  @(5, "bg-05-solifican12.png", "#facf64", "#e3a447", "#f8dd8d", "#b77542", "#a25f3b", "#45b7ff", "road"),
  @(6, "bg-06-lucia.png", "#152b4c", "#25395b", "#596985", "#76583f", "#664831", "#ffcf8a", "folklore"),
  @(7, "bg-07-mmmm.png", "#493b54", "#66506d", "#8c7893", "#2a2331", "#3e3a44", "#ff8fc7", "studio"),
  @(8, "bg-08-llora-llora.png", "#0f2d3b", "#16475a", "#4e7985", "#102e3b", "#2c6268", "#9ef7ff", "rain"),
  @(9, "bg-09-recorde.png", "#5b3d30", "#7b5742", "#c3a679", "#3d4d43", "#395b50", "#e9d8a6", "memory"),
  @(10, "bg-10-cuando-el-agua-hirviendo.png", "#4d171d", "#702631", "#9b5850", "#28222a", "#6a4834", "#ffdf6f", "kitchen"),
  @(11, "bg-11-la-vida-era-mas-corta.png", "#1f2236", "#363952", "#6b6e84", "#272a3e", "#8d6b94", "#edf2f4", "clock"),
  @(12, "bg-12-radamel.png", "#0e6342", "#24a065", "#73b57e", "#335c37", "#2c542f", "#ffffff", "field"),
  @(13, "bg-13-el-invisible.png", "#1a241b", "#2e3d29", "#6b7658", "#273322", "#656d4a", "#caffbf", "invisible"),
  @(14, "bg-14-luciernagas.png", "#08121f", "#102436", "#26384a", "#254733", "#365945", "#faff70", "fireflies"),
  @(15, "bg-15-jangadero.png", "#17465c", "#2d7490", "#78a9b7", "#5c5149", "#7f674f", "#ffd166", "river")
)

foreach ($bg in $backgrounds) {
  New-Background $bg[0] $bg[1] $bg[2] $bg[3] $bg[4] $bg[5] $bg[6] $bg[7] $bg[8]
}

$sheet = New-Object System.Drawing.Bitmap 512, 192
$sg = [System.Drawing.Graphics]::FromImage($sheet)
$sg.Clear([System.Drawing.Color]::Transparent)

function Draw-MiloFrame($g, $x, $y, $actual, $frame) {
  $skin = if ($actual) { "#c98e69" } else { "#d9a276" }
  $jacket = if ($actual) { "#4b241b" } else { "#2d5d86" }
  $jacket2 = if ($actual) { "#6a3829" } else { "#477da8" }
  $pants = if ($actual) { "#17171b" } else { "#1f2a44" }
  $hair = "#101010"
  $shirt = if ($actual) { "#4b241b" } else { "#f0f0f0" }
  $gold = "#ffd54a"
  $bob = if ($frame -in @(1,2,3)) { 1 } else { 0 }
  $armSwing = @(-2,1,3,-1,0,0,2,-2)[$frame]
  $legA = @(0,2,-2,3,0,0,1,-1)[$frame]
  $legB = @(0,-2,2,-3,1,1,-1,1)[$frame]
  if ($frame -eq 5) { $bob = -5 }
  if ($frame -eq 6) { $bob = 3 }
  if ($frame -eq 7) { $bob = 0 }

  Fill-Ellipse $g "#00000022" ($x+16) ($y+84) 34 5
  Fill-Rect $g $hair ($x+20) ($y+8+$bob) 25 6
  Fill-Rect $g $hair ($x+16) ($y+14+$bob) 33 7
  if (-not $actual) { Fill-Rect $g $hair ($x+14) ($y+20+$bob) 8 5; Fill-Rect $g $hair ($x+42) ($y+20+$bob) 7 5 }
  Fill-Rect $g $skin ($x+20) ($y+22+$bob) 25 18
  Fill-Rect $g "#111111" ($x+26) ($y+29+$bob) 3 3
  Fill-Rect $g "#111111" ($x+38) ($y+29+$bob) 3 3
  Fill-Rect $g "#743a32" ($x+30) ($y+38+$bob) 9 2
  if ($actual) { Fill-Rect $g $gold ($x+37) ($y+37+$bob) 3 3 }
  Fill-Rect $g $jacket ($x+15) ($y+43+$bob) 34 24
  Fill-Rect $g $jacket2 ($x+17) ($y+45+$bob) 8 20
  Fill-Rect $g $shirt ($x+27) ($y+43+$bob) 12 23
  if ($actual) { Fill-Rect $g "#d8d0c0" ($x+32) ($y+44+$bob) 2 22; Fill-Rect $g "#b69b6b" ($x+39) ($y+48+$bob) 5 15 }
  Fill-Rect $g $skin ($x+10) ($y+47+$bob+$armSwing) 7 17
  Fill-Rect $g $skin ($x+48) ($y+47+$bob-$armSwing) 7 17
  Fill-Rect $g $pants ($x+20) ($y+65+$bob) 10 (19+$legA)
  Fill-Rect $g $pants ($x+35) ($y+65+$bob) 10 (19+$legB)
  Fill-Rect $g "#efefef" ($x+16) ($y+83+$bob+$legA) 14 4
  Fill-Rect $g "#efefef" ($x+34) ($y+83+$bob+$legB) 14 4
}

for ($row=0; $row -lt 2; $row++) {
  for ($col=0; $col -lt 8; $col++) {
    Draw-MiloFrame $sg ($col * 64) ($row * 96) ($row -eq 1) $col
  }
}

$sheet.Save((Join-Path $artDir "milo-spritesheet.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$sg.Dispose()
$sheet.Dispose()

Write-Host "Generated 16 backgrounds and milo-spritesheet.png in public/art"
