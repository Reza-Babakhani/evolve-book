'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {".git/COMMIT_EDITMSG": "a8297d555dd34879e8e48e1cf12acefa",
".git/config": "e8ca51edf8afa602d9ac6a1039a3e867",
".git/description": "a0a7c3fff21f2aea3cfa1d0316dd816c",
".git/FETCH_HEAD": "38bd7101993d5335c60dc5fe519aece0",
".git/HEAD": "4cf2d64e44205fe628ddd534e1151b58",
".git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
".git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
".git/hooks/fsmonitor-watchman.sample": "a0b2633a2c8e97501610bd3f73da66fc",
".git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
".git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
".git/hooks/pre-commit.sample": "5029bfab85b1c39281aa9697379ea444",
".git/hooks/pre-merge-commit.sample": "39cb268e2a85d436b9eb6f47614c3cbc",
".git/hooks/pre-push.sample": "2c642152299a94e05ea26eae11993b13",
".git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
".git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
".git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
".git/hooks/push-to-checkout.sample": "c7ab00c7784efeadad3ae9b228d4b4db",
".git/hooks/sendemail-validate.sample": "4d67df3a8d5c98cb8565c07e42be0b04",
".git/hooks/update.sample": "647ae13c682f7827c22f5fc08a03674e",
".git/index": "f8e1b790c3362b76f8b3207b6aaddc70",
".git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
".git/logs/HEAD": "2f86bf4b19276befae83f6b95bfae628",
".git/logs/refs/heads/master": "2f86bf4b19276befae83f6b95bfae628",
".git/logs/refs/remotes/origin/master": "58f4e230b202762597f4a19cd85ba6f8",
".git/objects/07/d937e43ad016a34c5798429f71fe0bc18938b1": "e5d37cf70af10d593a290aeee91db17f",
".git/objects/08/27c17254fd3959af211aaf91a82d3b9a804c2f": "360dc8df65dabbf4e7f858711c46cc09",
".git/objects/0e/3a769bf49648086793d61454437e65c5d45025": "fe16740d980781b64dab787fb7f06638",
".git/objects/15/d4330da124c25ee21ff1bbfbdbf8760e7bcaa2": "4087d0c06f183e7c023b020862f74347",
".git/objects/16/7bc721c11b5e5a171fbcce9baa3eb5aa66b2e8": "26a5f18e2d7b8afc01bd3a288a2b3a72",
".git/objects/1b/f662e80d9b344de1921cacf5594e7cb186dd81": "edebae00a794b670c5e02ad63abb8e92",
".git/objects/23/1b6fd17e995938e3d6610e38639fd0f47fd536": "6717998956b6845ca3d6bb3ee4b16456",
".git/objects/23/ef64758f185485ad94251a89e8f21fe0b126af": "33e2622246d2eb676448bcc7b598871a",
".git/objects/30/6942dc5bda024438722d4da845f397d2b10e14": "682a06660c7a1bece06811374e7444ab",
".git/objects/37/3a93637ab520cb0f60b5dcb3aa67312b42977f": "319c24d972f5d6bef6c58134dedd422f",
".git/objects/39/d5ae27786874c0525c5c8ed4a466c0ed9cdf22": "2a317d9985294cd47491c527ec43faed",
".git/objects/3a/8cda5335b4b2a108123194b84df133bac91b23": "1636ee51263ed072c69e4e3b8d14f339",
".git/objects/3b/8158e2dea3c15fe9408f59721329c95270a0c0": "f8c7ba6d2f492539bed7a490763db456",
".git/objects/3b/dd02f56182c7659adceb5a524f6a184b519dd8": "6275598c929f9421e4af016dcab12f8d",
".git/objects/41/1246f0f5b619c8a5cbbd448ccb5acbfcd2938f": "4e47c0845ebd26a90d5f21b2759472d3",
".git/objects/4b/825dc642cb6eb9a060e54bf8d69288fbee4904": "75589287973d2772c2fc69d664e10822",
".git/objects/51/03e757c71f2abfd2269054a790f775ec61ffa4": "d437b77e41df8fcc0c0e99f143adc093",
".git/objects/58/5f220f88d5a5afc13e6955783dad7fc4037d30": "fa5ccf2d76f0809d2948899f0bde6796",
".git/objects/59/2f65c545f400204b72765fce991433b568e7c8": "6fc79b41cc37801eb11345692ae9e0a4",
".git/objects/5c/c711f85e58746e5b0eb1fd7da179961dd86f0f": "3cd8f524515c426864b51e0dfbc9440f",
".git/objects/5d/db73bd61faba98a228a72b2b68a4d88114a44a": "ca6ae488ed17420f280f5f3dd8201b19",
".git/objects/66/1b513a8aa0a94ace87a67d0173cfbd1cb8e354": "292fda88e0ecfc10c3e3e5979c761ee1",
".git/objects/68/43fddc6aef172d5576ecce56160b1c73bc0f85": "2a91c358adf65703ab820ee54e7aff37",
".git/objects/68/4ebd569fbeb890b1d8d3ce73cfdf3bb4d78022": "5426d825b86be5392670df2e71e30aa0",
".git/objects/6d/f2b253603094de7f39886aae03181c686e375b": "4e432986780adf1da707b08f0bc71809",
".git/objects/6f/7661bc79baa113f478e9a717e0c4959a3f3d27": "985be3a6935e9d31febd5205a9e04c4e",
".git/objects/72/7c3cb721dd33abd674a8f166628de3f7617646": "f9e1694120b51f1cd6c02d79fc667ab7",
".git/objects/78/8b034615a06d854e97e46aad100eb6f71aa6bb": "e4b5131cd0dacf7bce74f541ccaa6fb6",
".git/objects/7c/3463b788d022128d17b29072564326f1fd8819": "37fee507a59e935fc85169a822943ba2",
".git/objects/80/65900ca445de977c6f4dc5a85dd7cecaf1b6ba": "1ccd453d2a7333e51b81f223d67382c0",
".git/objects/85/63aed2175379d2e75ec05ec0373a302730b6ad": "997f96db42b2dde7c208b10d023a5a8e",
".git/objects/8e/21753cdb204192a414b235db41da6a8446c8b4": "1e467e19cabb5d3d38b8fe200c37479e",
".git/objects/93/b363f37b4951e6c5b9e1932ed169c9928b1e90": "c8d74fb3083c0dc39be8cff78a1d4dd5",
".git/objects/97/64e013b3c3ac0cff5ba8978b9f63f162a73c94": "f6b8b3eb53cb46e41d9b7c9e5b8dfa50",
".git/objects/97/b6eee463de5e4fcf79c6570e4173f50eca81d5": "b58977ec52e0607f13c5710fd432ef21",
".git/objects/a7/3f4b23dde68ce5a05ce4c658ccd690c7f707ec": "ee275830276a88bac752feff80ed6470",
".git/objects/a9/91f51138ffe059d588003dc7936aff059a0428": "b73a35563fa129bd884d8b5c53ee9231",
".git/objects/ad/2f90b78480aeb6608226d9db4ecbd3ec06aaeb": "4add97a99941aa0e9eed0f2173416ade",
".git/objects/ad/ced61befd6b9d30829511317b07b72e66918a1": "37e7fcca73f0b6930673b256fac467ae",
".git/objects/b1/5b83e597e3ae3e823752063f6949f363c7f89d": "dd211efe7f2964c39383cdf881b344e9",
".git/objects/b2/65ed4d1aeed8cefebd1168b81a6ffb368b0cdb": "1bb905c1172188cf1c3a2e9fa123dccf",
".git/objects/b3/b5e9db0a594baaed9faefc790fbe679f2001b3": "95d155b8758fba26591861f6431929c2",
".git/objects/b7/0860aef276d8d145af50a71978c71fd49f3006": "225d3fabc29813b0c4a7a87ad5c03af4",
".git/objects/b9/3e39bd49dfaf9e225bb598cd9644f833badd9a": "666b0d595ebbcc37f0c7b61220c18864",
".git/objects/b9/f3492df2246ac74a35c1cf49ec8590c46f0c37": "89496a3087b2c3dbecc6c6bc2f6dfa53",
".git/objects/bb/9e56a8c5f124b8c9a989380024882688460d46": "5258c69bc16ce9473e32cb9390fe40f0",
".git/objects/bc/7d993f94baf32ca11e5f5dc5412aac12a668a9": "d782f8a82d795ae96da7df117f4c51bd",
".git/objects/bd/547246b335937311ee9ba71d229aec62f094a4": "6408e014efeb39abd97652eba9e4403d",
".git/objects/bd/b00e6faa9a0e6e5c36cbae405dae4a5bd73e51": "5fbdc7629e53bc2bc89261437bf2f572",
".git/objects/c8/3af99da428c63c1f82efdcd11c8d5297bddb04": "144ef6d9a8ff9a753d6e3b9573d5242f",
".git/objects/c8/a9059c6a541a383e89d938ab72dba955f7ab84": "a3352582960228a7b90ac1895b9c7fab",
".git/objects/c8/ff11e15459958332fac16589019b391334d8d5": "e13237781899946b253b57e8306edb15",
".git/objects/ca/28c42816e1ba98b5202e9a751a7a71c42d96e6": "963cafb9d7043e8a4b08248318128b18",
".git/objects/cb/e0e5b48b775b1bc5c610061c942b786f1009c4": "fcd8b31d2264922f53ae462fcd20379f",
".git/objects/cc/fab74c1f56c330985060e2247607eaedb3c7d7": "ad5b6117df489509af208438785f208b",
".git/objects/ce/febd406cd8ff192063459a88a958ed2a6e685f": "0c3fd88c2c23a846b522714b4ad2700f",
".git/objects/d4/3532a2348cc9c26053ddb5802f0e5d4b8abc05": "3dad9b209346b1723bb2cc68e7e42a44",
".git/objects/d9/5b1d3499b3b3d3989fa2a461151ba2abd92a07": "a072a09ac2efe43c8d49b7356317e52e",
".git/objects/e0/9d96f95ed17a49f11dac30ba1705549950d944": "0fcac07de4721203daeac207d3eb16e2",
".git/objects/e7/a7af539a43bec07718f56b1a73cfcb22776a6a": "0eac27d71ad639881d03cdc0ef74384a",
".git/objects/f3/3e0726c3581f96c51f862cf61120af36599a32": "afcaefd94c5f13d3da610e0defa27e50",
".git/objects/f6/cc06a0d471df5df1f35082b09b45fced798d05": "b3ed116bd3c82d600d635270058f4345",
".git/objects/f6/e6c75d6f1151eeb165a90f04b4d99effa41e83": "95ea83d65d44e4c524c6d51286406ac8",
".git/objects/f8/aa3caf7daa9dc3077baec44480a4ebba63431c": "f84ddcfda028e99e8d7c92a4d4ad8b03",
".git/objects/fd/05cfbc927a4fedcbe4d6d4b62e2c1ed8918f26": "5675c69555d005a1a244cc8ba90a402c",
".git/objects/fd/d46db9738d070ba10587246f3690c16d19dd51": "fb8957d60075ff27b2d1407f8b937a74",
".git/refs/heads/master": "89e60d1c0518e60ed2ea0964cd672844",
".git/refs/remotes/origin/master": "d1f8e14e3d08665bf0ce2a1f6eeebabd",
"apple-touch-icon.png": "868f7c8a23aab71100afeaa0a5727091",
"assets/AssetManifest.bin": "a059bc15feffd8f8b30f9df77bb1b32b",
"assets/AssetManifest.bin.json": "b14ccc11673a672bb6637cd47afcdd0a",
"assets/FontManifest.json": "2b52acee7bee9f34d372a965ef37754f",
"assets/fonts/MaterialIcons-Regular.otf": "45d749641b463932d6a00fa6af3adc2e",
"assets/NOTICES": "a1b013cb3f41479fa0bdfe93c005ad90",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "d7d83bd9ee909f8a9b348f56ca7b68c6",
"assets/packages/syncfusion_flutter_pdfviewer/assets/fonts/RobotoMono-Regular.ttf": "5b04fdfec4c8c36e8ca574e40b7148bb",
"assets/packages/syncfusion_flutter_pdfviewer/assets/highlight.png": "7384946432b51b56b0990dca1a735169",
"assets/packages/syncfusion_flutter_pdfviewer/assets/squiggly.png": "c9602bfd4aa99590ca66ce212099885f",
"assets/packages/syncfusion_flutter_pdfviewer/assets/strikethrough.png": "cb39da11cd936bd01d1c5a911e429799",
"assets/packages/syncfusion_flutter_pdfviewer/assets/underline.png": "c94a4441e753e4744e2857f0c4359bf0",
"assets/packages/wakelock_plus/assets/no_sleep.js": "7748a45cd593f33280669b29c2c8919a",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01",
"favicon.ico": "1ec24e7ff2ecf429aaaf2aab9d8b5b0b",
"favicon.png": "e89cc5e59938f94c22ec996d1e5392cc",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"flutter_bootstrap.js": "ee62986c4836e6184ee92a6b80c9cd30",
"icon-192-maskable.png": "a6c0d73062ed89a1cd58a121d786d8b8",
"icon-192.png": "06fc69653d4f56646ab5000f7f2bade5",
"icon-512-maskable.png": "c8a370faaf491b22fa0c5f0cae2dc2b5",
"icon-512.png": "c11edeb1db568cd234238b1e3778cc92",
"icons/Icon-192.png": "812f56f4d3979fbe452d3f006170bbf3",
"icons/Icon-512.png": "162533b6b1cff894dde98299d0a4ec82",
"icons/Icon-maskable-192.png": "812f56f4d3979fbe452d3f006170bbf3",
"icons/Icon-maskable-512.png": "162533b6b1cff894dde98299d0a4ec82",
"index.html": "648c8ae07823d81b46bb58bddeb22061",
"/": "648c8ae07823d81b46bb58bddeb22061",
"main.dart.js": "6520df91fcaf6f2323e17ac4aeaa124e",
"manifest.json": "db182d07585a44e462a3c4e5fcc8e900",
"README.txt": "d3df3991a31f034bfa98afdfa3c622e1",
"version.json": "5d9c3001de0c691557cb7ca74b43ada3"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
