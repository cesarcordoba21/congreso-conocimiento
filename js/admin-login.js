const SUPABASE_URL =
    "https://fwbxdywcccsbtjihycit.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_nscW8XOQobXfS_uXUyCSQw_cF_XHFXN";


const adminSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


const adminLoginForm =
    document.querySelector("#admin-login-form");

const adminLoginMessage =
    document.querySelector("#admin-login-message");


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",

        async function (event) {

            event.preventDefault();


            const email =
                document
                    .querySelector("#admin-email")
                    .value
                    .trim();

            const password =
                document
                    .querySelector("#admin-password")
                    .value;


            adminLoginMessage.textContent =
                "Iniciando sesión...";


            const {
                data,
                error
            } =
                await adminSupabase.auth
                    .signInWithPassword({
                        email,
                        password
                    });


            if (error) {

                console.error(error);

                adminLoginMessage.textContent =
                    "Correo o contraseña incorrectos.";

                return;
            }


            if (data.session) {

                window.location.href =
                    "admin.html";

            }

        }
    );

}