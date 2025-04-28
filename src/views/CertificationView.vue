<template>
  <div class="container mx-auto p-3 md:px-4">
    <div class="flex flex-col-reverse md:flex-row relative">
      <div class="w-full md:w-full">
        <div class="flex flex-col gap-4 fade-zoom-up">
          <article v-for="certificate in certificates" :key="certificate.id">
            <div class="flex w-full bg-[#1e1e1f] border-[#383838] rounded-xl text-left text-white p-5 md:py-7 md:px-8 items-center">
              <div class="w-full pr-4">
                <div class="text-xs mb-1 text-slate-400 flex items-center italic">
                  <div class="h-[1px] w-20 bg-amber-200 md:w-5 aos-init aos-animate mr-2"></div> 
                  {{ certificate.issuedDate }}
                </div>
                <a :href="certificate.link" target="_blank" class="hover:underline">
                  <h1 class="text-sm md:text-md text-amber-200 font-bold mb-2 paraf">{{ certificate.name }}</h1>
                </a>
                <div class="text-sm hidden md:block paraf">{{ certificate.description }}</div>
              </div>
              <div>
                <a :href="certificate.link" target="_blank">
                  <div class="w-30 md:w-41 flex items-center">
                    <img :src="`/img/${certificate.image}`" class="rounded-lg md:rounded-xl object-contain w-38" alt="Certificate Image">
                  </div>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      certificates: []
    }
  },
  mounted() {
    this.getCertificates();
  },
  methods: {
    async getCertificates() {
      // Bisa dari API, tapi di sini contoh data statis lokal
      this.certificates = [
        {
          id: 1,
          name: "MySkill Short Class - Data Visualization for Data Analysis",
          issuedDate: "2023-07-04",
          image: "certificate-myskill1.jpg",
          link: "https://drive.google.com/file/d/1wjRYpDybyBxgBkfI0zyoPcDHcd2beyjS/view",
          description: "Completed the short class 'Data Visualization for Data Analysis' in the Data Analysis category organized by MySkill.id"
        },
        {
          id: 2,
          name: "MySkill Short Class - Figma for UI/UX Design",
          issuedDate: "2023-07-05",
          image: "certificate-myskill2.jpg",
          link: "https://drive.google.com/file/d/1LN8KW94KzNAGkL8EmIx1dvWQwtAsnpEY/view",
          description: "Completed the short class 'Figma for UI/UX Design' in the UI/UX Research and Design category organized by MySkill.id."
        },
        {
          id: 3,
          name: "Dicoding - Belajar Dasar Visualisasi Data",
          issuedDate: "2023-08-15",
          image: "certificate-dicoding.jpg",
          link: "https://www.dicoding.com/certificates/81P23R2QQXOY",
          description: "Completed the 'Learn Basic Data Visualization' class organized by Dicoding Indonesia and received a certificate of completion."
        },
        {
          id: 4,
          name: "PPK Ormawa 2024",
          issuedDate: "2024-11-16",
          image: "certificate-ppko.jpg",
          link: "https://drive.google.com/file/d/1irZDHQs7TDrNmEGva1kPMeyWJywmEFMi/view",
          description: "Acting as the Implementation Team in the 2024 Student Organization Capacity Building Program (PPK Ormawa) organized by the Directorate General of Higher Education, Research, and Technology, Ministry of Education, Culture, Research, and Technology."
        },
        {
          id: 5,
          name: "Google Akademi Analytics - Google Analytics untuk Pemula",
          issuedDate: "2023-08-15",
          image: "certificate-goggle.jpg",
          link: "https://www.linkedin.com/in/muhamadfrhn/overlay/1707044972474/single-media-viewer/?profileId=ACoAADyMc3QBvQYQUejUksrPqiuriwOkni0VIB4",
          description: "Completed the 'Google Analytics for Beginners' course from Google Analytics Academy and obtained a certificate of completion."
        },
        {
          id: 6,
          name: "Cisco Networking Academy",
          issuedDate: "2023-08-16",
          image: "certificate-cisco.jpg",
          link: "https://www.credly.com/badges/09507c11-1b98-4690-982d-9e4c034601ce",
          description: "Successfully achieved level credential for completing the Data Analytics Essentials course."
        }
      ]
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 100%;
  padding: 16px;
}

.certificate-card {
  transition: all 0.3s ease-in-out;
}

.certificate-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
}

.certificate-image {
  transition: all 0.3s ease-in-out;
}

.certificate-image:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.fade-zoom-up {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 768px) {
  .certificate-image {
    max-width: 120px;
  }
}
</style>
