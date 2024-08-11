import type { MessagesType } from './type';

/** 创建图标 */
export const createIcon = (type: MessagesType | 'close') => {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.classList.add(`sk-icon-${type}`);
  icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  icon.setAttribute('viewBox', '0 0 1024 1024');
  switch (type) {
    case 'info':
      createInfoPath(icon);
      break;
    case 'success':
      createSuccessPath(icon);
      break;
    case 'warning':
      createWarningPath(icon);
      break;
    case 'error':
      createErrorPath(icon);
      break;
    case 'help':
      createHelpPath(icon);
      break;
    case 'close':
      createClosePath(icon);
      break;
  }
  return icon;
};

/** Info 图标 */
const createInfoPath = (svg: SVGSVGElement) => {
  const paths = [
    'M1024 512C1024 229.230208 794.769792 0 512 0 229.230208 0 0 229.230208 0 512 0 794.769792 229.230208 1024 512 1024 629.410831 1024 740.826187 984.331046 830.768465 912.686662 841.557579 904.092491 843.33693 888.379234 834.742758 877.590121 826.148587 866.801009 810.43533 865.021658 799.646219 873.615827 718.470035 938.277495 618.001779 974.048781 512 974.048781 256.817504 974.048781 49.951219 767.182496 49.951219 512 49.951219 256.817504 256.817504 49.951219 512 49.951219 767.182496 49.951219 974.048781 256.817504 974.048781 512 974.048781 599.492834 949.714859 683.336764 904.470807 755.960693 897.177109 767.668243 900.755245 783.071797 912.462793 790.365493 924.170342 797.659191 939.573897 794.081058 946.867595 782.373508 997.013826 701.880796 1024 608.898379 1024 512Z',
    'M499.512194 743.02439C499.512194 756.818039 510.694157 768 524.487806 768 538.281453 768 549.463415 756.818039 549.463415 743.02439L549.463415 424.585365C549.463415 410.791718 538.281453 399.609756 524.487806 399.609756 510.694157 399.609756 499.512194 410.791718 499.512194 424.585365L499.512194 743.02439Z',
    'M499.512194 318.439025C499.512194 332.232672 510.694157 343.414635 524.487806 343.414635 538.281453 343.414635 549.463415 332.232672 549.463415 318.439025L549.463415 274.731708C549.463415 260.938059 538.281453 249.756098 524.487806 249.756098 510.694157 249.756098 499.512194 260.938059 499.512194 274.731708L499.512194 318.439025Z'
  ];
  for (const d of paths) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  }
};

/** Success 图标 */
const createSuccessPath = (svg: SVGSVGElement) => {
  const paths = [
    'M464.247573 677.487844C474.214622 686.649009 489.665824 686.201589 499.086059 676.479029L798.905035 367.037897C808.503379 357.131511 808.253662 341.319802 798.347275 331.721455 788.44089 322.12311 772.62918 322.372828 763.030833 332.279215L463.211857 641.720346 498.050342 640.711531 316.608838 473.940461C306.453342 464.606084 290.653675 465.271735 281.319298 475.427234 271.984922 485.582733 272.650573 501.382398 282.806071 510.716774L464.247573 677.487844Z',
    'M1024 512C1024 229.230208 794.769792 0 512 0 229.230208 0 0 229.230208 0 512 0 794.769792 229.230208 1024 512 1024 629.410831 1024 740.826187 984.331046 830.768465 912.686662 841.557579 904.092491 843.33693 888.379234 834.742758 877.590121 826.148587 866.801009 810.43533 865.021658 799.646219 873.615827 718.470035 938.277495 618.001779 974.048781 512 974.048781 256.817504 974.048781 49.951219 767.182496 49.951219 512 49.951219 256.817504 256.817504 49.951219 512 49.951219 767.182496 49.951219 974.048781 256.817504 974.048781 512 974.048781 599.492834 949.714859 683.336764 904.470807 755.960693 897.177109 767.668243 900.755245 783.071797 912.462793 790.365493 924.170342 797.659191 939.573897 794.081058 946.867595 782.373508 997.013826 701.880796 1024 608.898379 1024 512Z'
  ];
  for (const d of paths) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  }
};

/** Warning 图标 */
const createWarningPath = (svg: SVGSVGElement) => {
  const paths = [
    'M598.272514 158.17909C545.018272 71.994036 451.264177 71.951401 397.724122 158.397341L25.049726 760.118586C-28.93569 847.283607 14.324655 927.325257 116.435565 929.308966L891.057077 929.313666C993.88467 931.315989 1036.926865 868.038259 983.25955 781.189694 980.374633 776.521099 980.374633 776.521099 971.719878 762.515313 967.393745 755.514432 967.393745 755.514432 963.78822 749.679695 956.511588 737.90409 941.113263 734.285867 929.3951 741.59817 917.676937 748.910473 914.076365 764.384279 921.352996 776.159885 924.958522 781.994622 924.958522 781.994622 929.284655 788.995503 937.939409 803.001289 937.939409 803.001289 940.824326 807.669884 972.284602 858.581314 957.441559 880.402549 891.539823 879.122276L116.918309 879.117577C54.037254 877.891296 33.95555 840.735497 67.458075 786.642217L440.132471 184.920971C474.112981 130.055931 522.112175 130.077759 556.029583 184.965509L857.08969 656.83971C864.534622 668.508595 879.98329 671.9032 891.595253 664.421773 903.207217 656.940343 906.585263 641.415949 899.140331 629.747063L598.272514 158.17909Z',
    'M474.536585 619.793346C474.536585 633.654611 485.718547 644.891386 499.512194 644.891386 513.305843 644.891386 524.487806 633.654611 524.487806 619.793346L524.487806 299.793346C524.487806 285.932082 513.305843 274.695307 499.512194 274.695307 485.718547 274.695307 474.536585 285.932082 474.536585 299.793346L474.536585 619.793346Z',
    'M474.465781 776.736145C474.565553 790.597047 485.828105 801.75225 499.621393 801.651987 513.414679 801.551725 524.515467 790.233967 524.415695 776.373065L523.955031 712.375667C523.855258 698.514767 512.592708 687.359563 498.79942 687.459825 485.006133 687.560087 473.905346 698.877847 474.005118 712.738748L474.465781 776.736145Z'
  ];
  for (const d of paths) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  }
};

/** Error 图标 */
const createErrorPath = (svg: SVGSVGElement) => {
  const paths = [
    'M1024 512C1024 229.230208 794.769792 0 512 0 229.230208 0 0 229.230208 0 512 0 794.769792 229.230208 1024 512 1024 629.410831 1024 740.826187 984.331046 830.768465 912.686662 841.557579 904.092491 843.33693 888.379234 834.742758 877.590121 826.148587 866.801009 810.43533 865.021658 799.646219 873.615827 718.470035 938.277495 618.001779 974.048781 512 974.048781 256.817504 974.048781 49.951219 767.182496 49.951219 512 49.951219 256.817504 256.817504 49.951219 512 49.951219 767.182496 49.951219 974.048781 256.817504 974.048781 512 974.048781 599.492834 949.714859 683.336764 904.470807 755.960693 897.177109 767.668243 900.755245 783.071797 912.462793 790.365493 924.170342 797.659191 939.573897 794.081058 946.867595 782.373508 997.013826 701.880796 1024 608.898379 1024 512Z',
    'M331.838918 663.575492C322.174057 673.416994 322.317252 689.230029 332.158756 698.894891 342.000258 708.559753 357.813293 708.416557 367.478155 698.575053L717.473766 342.182707C727.138628 332.341205 726.995433 316.528171 717.153931 306.863309 707.312427 297.198447 691.499394 297.341643 681.834532 307.183147L331.838918 663.575492Z',
    'M681.834532 698.575053C691.499394 708.416557 707.312427 708.559753 717.153931 698.894891 726.995433 689.230029 727.138628 673.416994 717.473766 663.575492L367.478155 307.183147C357.813293 297.341643 342.000258 297.198447 332.158756 306.863309 322.317252 316.528171 322.174057 332.341205 331.838918 342.182707L681.834532 698.575053Z'
  ];
  for (const d of paths) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  }
};

/** Help 图标 */
const createHelpPath = (svg: SVGSVGElement) => {
  const paths = [
    'M1024 512C1024 229.230208 794.769792 0 512 0 229.230208 0 0 229.230208 0 512 0 794.769792 229.230208 1024 512 1024 629.410831 1024 740.826187 984.331046 830.768465 912.686662 841.557579 904.092491 843.33693 888.379234 834.742758 877.590121 826.148587 866.801009 810.43533 865.021658 799.646219 873.615827 718.470035 938.277495 618.001779 974.048781 512 974.048781 256.817504 974.048781 49.951219 767.182496 49.951219 512 49.951219 256.817504 256.817504 49.951219 512 49.951219 767.182496 49.951219 974.048781 256.817504 974.048781 512 974.048781 599.492834 949.714859 683.336764 904.470807 755.960693 897.177109 767.668243 900.755245 783.071797 912.462793 790.365493 924.170342 797.659191 939.573897 794.081058 946.867595 782.373508 997.013826 701.880796 1024 608.898379 1024 512Z',
    'M533.078812 691.418556C551.918022 691.418556 567.190219 706.673952 567.190219 725.511386L567.190219 734.541728C567.190219 753.370677 552.049365 768.634558 533.078812 768.634558L533.078812 768.634558C514.239601 768.634558 498.967405 753.379162 498.967405 734.541728L498.967405 725.511386C498.967405 706.682436 514.108258 691.418556 533.078812 691.418556L533.078812 691.418556ZM374.634146 418.654985C374.634146 418.654985 377.308518 442.210609 403.631972 442.210609 429.955424 442.210609 431.511799 418.654985 431.511799 418.654985 429.767552 342.380653 465.107535 306.162338 537.45591 309.760186 585.612324 315.19693 610.562654 342.380653 612.231066 391.391309 608.894242 413.21824 590.617557 441.441342 558.083539 475.90071 515.008196 519.47462 493.470524 558.49126 493.470524 592.950626L493.470524 628.289468C493.470524 628.289468 496.775846 649.365867 520.582206 649.365867 544.388565 649.365867 547.693888 628.289468 547.693888 628.289468L547.693888 603.744164C547.693888 574.961397 568.321517 540.342125 609.652612 500.28611 652.879629 460.469948 674.341463 424.091729 674.341463 391.391309 670.777131 300.725594 623.530758 253.473886 532.223166 249.796087 427.189099 248.037141 374.634146 304.323439 374.634146 418.654985Z'
  ];
  for (const d of paths) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  }
};

/** Close 图标 */
const createClosePath = (svg: SVGSVGElement) => {
  const paths = [
    'M176.661601 817.172881C168.472798 825.644055 168.701706 839.149636 177.172881 847.338438 185.644056 855.527241 199.149636 855.298332 207.338438 846.827157L826.005105 206.827157C834.193907 198.355983 833.964998 184.850403 825.493824 176.661601 817.02265 168.472798 803.517069 168.701706 795.328267 177.172881L176.661601 817.172881Z',
    'M795.328267 846.827157C803.517069 855.298332 817.02265 855.527241 825.493824 847.338438 833.964998 839.149636 834.193907 825.644055 826.005105 817.172881L207.338438 177.172881C199.149636 168.701706 185.644056 168.472798 177.172881 176.661601 168.701706 184.850403 168.472798 198.355983 176.661601 206.827157L795.328267 846.827157Z'
  ];
  for (const d of paths) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  }
};