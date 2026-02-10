import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToggle } from "@/hooks/useToggle";
import { useGetCategoriesAndBrands } from "@/hooks/useGetCategoriesAndBrands";
import { useProductForm } from "@/hooks/useProductForm";

export function CreateProduct(props) {
  const { fetchProducts } = props;

  const { current, handleToggle } = useToggle(false);

  const { handleInputChange, handleSubmit, values } = useProductForm(
    handleToggle,
    fetchProducts
  );

  const { data } = useGetCategoriesAndBrands();

  return (
    <>
      <Dialog open={current} onOpenChange={handleToggle}>
        {/* para poder activar el dialog usamos DialogTrigger */}
        <DialogTrigger asChild>
          <Button>Registrar Docentes</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Docente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <label name="name"className="text-xm text-center text-green-800">Apellido Paterno</label>
                <Input
                  name="name"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-xm text-center text-green-800">Apellido Materno</label>
                <Input
                  name="description"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-xm text-center text-green-800">Nombre</label>
                <Input
                  name="price"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Select value={values.brand} onValueChange={handleInputChange}>
                  <label className="text-xm text-center text-green-800">Marca</label>
                  <SelectTrigger className="w-full">
                  </SelectTrigger>
                  <SelectContent>
                    {data &&
                      data?.brands?.map((brand) => (
                        <SelectItem key={brand.id} value={`brand-${brand.id}`}>
                          {brand.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={values.category}
                  onValueChange={handleInputChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {data &&
                      data?.categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={`category-${category.id}`}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  name="image"
                  placeholder="Imagen"
                  type="file"
                  onChange={handleInputChange}
                  accept="image/png, image/gif, image/jpeg"
                />
              </div>
            </div>
            <div className="mt-5">
              <Button className="w-full">Enviar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={current} onOpenChange={handleToggle}>
        
        <DialogTrigger asChild>
          <Button>Registrar Alumnos</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Alumno</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <label name="name"className="text-xm text-center text-green-800">Apellido Paterno</label>
                <Input
                  name="name"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-xm text-center text-green-800">Apellido Materno</label>
                <Input
                  name="description"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-xm text-center text-green-800">Nombre</label>
                <Input
                  name="price"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Select value={values.brand} onValueChange={handleInputChange}>
                  <label className="text-xm text-center text-green-800">Marca</label>
                  <SelectTrigger className="w-full">
                  </SelectTrigger>
                  <SelectContent>
                    {data &&
                      data?.brands?.map((brand) => (
                        <SelectItem key={brand.id} value={`brand-${brand.id}`}>
                          {brand.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={values.category}
                  onValueChange={handleInputChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {data &&
                      data?.categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={`category-${category.id}`}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  name="image"
                  placeholder="Imagen"
                  type="file"
                  onChange={handleInputChange}
                  accept="image/png, image/gif, image/jpeg"
                />
              </div>
            </div>
            <div className="mt-5">
              <Button className="w-full">Enviar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </>
  );
}
