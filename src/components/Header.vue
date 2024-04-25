<template>
    <header class="p-3 bg-dark text-white">
        <div class="container-fluid">
            <div class="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
                <div class="d-flex justify-content-center align-items-center logo">
                    <img class="w-50" src="../assets/9x.png" alt="">
                    <span class="meet">Meet</span>
                </div>

                <div class="text-end d-flex gap-3 align-items-center fs-4">
                    <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                      <li><a href="#" class="nav-link px-2 text-secondary">{{ alldate }}</a></li>
                      <li><a href="#" class="nav-link px-2 text-secondary">About</a></li>
                      <li><a href="#" class="nav-link px-2 text-secondary">Contact</a></li>
                    </ul>
                    <div>
                      <button type="button" class="btn btn-outline-light me-2">Login</button>
                      <button type="button" class="btn btn-warning">Sign-up</button>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            alldate: '',
        }
    },
    created() {
        this.AllDate()
    },
    methods: {
        AllDate() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var ampm = hour >= 12 ? `PM` : `AM`;
            this.alldate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute+" "+ampm;
        }
    }

}
</script>

<style scoped>
.logo .meet{
    font-size: 24px;
    text-transform: uppercase;
    font-weight: 600;
    color: #bc9847;
}
</style>