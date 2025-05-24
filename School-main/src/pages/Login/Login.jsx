import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import logo from "../../assets/img/logo_sta.png";
import bg_major from "/src/assets/img/bg_major.jpg";
import { FaUser , FaLock, FaUserGraduate } from "react-icons/fa"; // Asegúrate de instalar react-icons

export function Login() {
  return (
      <section className="bg-[url(/src/assets/img/bg_major.jpg)] h-screen bg-cover 
                          flex justify-center items-center">
      <Card className="bg-white/50 backdrop-invert backdrop-opacity-20">
        <CardContent className="flex flex-row items-center">
          <div >
            <img src={logo} alt="Logo" className="w-80" />
          </div>
          <form className="space-y-3 p-6 bg-white/60 rounded-lg shadow-md">
            <div className=" flex flex-col items-center">
              <FaUserGraduate className="text-green-900 scale-200 mb-4" />
              <h2 className="text-l font-medium text-gray-500 text-center">Accede a tu cuenta</h2> 
            </div>
            <div className="flex items-center border-b border-gray-300">              
              <FaUser  className="text-gray-500 mr-2" />
              <label htmlFor="user" className="sr-only">Usuario</label>
              <Input id="user" type="text" placeholder="Cuenta" className="flex-1 shadow-" />
            </div>
            <div className="flex items-center border-b border-gray-300">
              <FaLock className="text-gray-500 mr-2" />
              <label htmlFor="password" className="sr-only">Password</label>
              <Input id="password" type="password" placeholder="Password"  className="flex-1" />
            </div>
            <div>
              <Button className="bg-green-800 w-full hover:bg-green-700 transition duration-200">Ingresar</Button>
            </div>
            <div className="text-center">
              <p className="text-green-800 text-sm font-bold hover:underline" onClick={() => alert('Recuperar contraseña')}>¿Olvidaste tu contraseña?</p>
            </div>
            <p className="text-xs text-center text-gray-500">Plataforma de Gestión Educativa</p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
