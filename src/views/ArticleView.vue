<template>
    <div class="container mx-auto p-3 md:p-8">
    <div class="flex flex-col-reverse md:flex-row relative">
      <div class="w-full md:w-2/3">
        <div class="flex flex-col gap-4 md:px-20 fade-zoom-up">
          <router-link
            v-for="certificate in certificates"
            :key="certificate.id"
            :to="`/certificates/${certificate.id}`"
            class="no-underline"
          >
            <div class="flex w-full bg-[#1e1e1f] border-[#383838] rounded-xl text-left text-white p-5 md:py-7 md:px-8 items-center hover:bg-[#2b2b2d] transition-all">
              <div class="w-full pr-4">
                <div class="text-xs mb-1 text-slate-400 flex items-center italic">
                  <div class="h-[1px] w-20 bg-amber-200 md:w-5 mr-2"></div> 
                  Issued: {{ certificate.issuedDate }}
                </div>
                <h1 class="text-sm md:text-md text-amber-200 font-bold mb-2">{{ certificate.name }}</h1>
                <div class="text-sm hidden md:block">{{ certificate.description }}</div>
              </div>
              <div>
                <div class="w-20 h-20 md:w-28 md:h-28 flex items-center">
                  <img :src="certificate.image" class="rounded-lg md:rounded-xl" alt="Certificate Image">
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
        
        <!-- Sidebar -->
        <div class="w-full md:w-1/3 h-fit p-8 md:sticky md:top-24">
          <div class="flex flex-col text-left">
            <div class="bg-clip-text bg-gradient-to-r from-slate-100 to-amber-300 text-transparent">
              Showcasing my certifications and achievements.
            </div>
            <div class="h-[1px] mt-7 mb-7 w-20 bg-amber-200"></div>
            <div class="hidden md:block">
              <div class="text-white text-md font-semibold">Categories</div>
              <div class="mt-3 flex flex-wrap gap-1">
                <span class="py-2 px-3 rounded-2xl bg-[#1e1e1f] hover:bg-white/20 text-white text-xs cursor-pointer">Web Development</span>
                <span class="py-2 px-3 rounded-2xl bg-[#1e1e1f] hover:bg-white/20 text-white text-xs cursor-pointer">Mobile</span>
                <span class="py-2 px-3 rounded-2xl bg-[#1e1e1f] hover:bg-white/20 text-white text-xs cursor-pointer">Cloud</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
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
        try {
          const response = await axios.get('https://64a38c9cc3b509573b564183.mockapi.io/api/blog/all');
          this.certificates = response.data.map(cert => ({
            id: cert.id,
            name: cert.title, // assuming 'title' is the certificate name
            issuedDate: cert.date,
            image: cert.image,
            description: cert.desc
          }));
        } catch (error) {
          console.error("Error fetching certificates:", error);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  @media (min-width: 768px) {
    .paraf {
      display: -webkit-box;
    }
  }
  .paraf {
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  @keyframes fadeZoomUp {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  .fade-zoom-up {
    animation: fadeZoomUp 1s ease-in-out;
  }
  </style>
  