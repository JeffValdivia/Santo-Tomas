import { useEffect, useState } from "react";
import { getDataFromTable } from "@/services/supabase";
import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";

export function useGetProducts() {
  const [tableData, setTableData] = useState({
    columns: [],
    data: [],
  });

  const generateColumns = () => {
    const columnHelper = createColumnHelper();
    const columns = [
      columnHelper.accessor("name", {
        header: "Apellido Paterno",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("description", {
        header: "Apellido Materno",
        cell: (info) => info.getValue(),  
      }),
      columnHelper.accessor("price", {
        header: "Nombre",
        cell: (info) => ` ${info.getValue()}`,
      }),
      columnHelper.accessor("brands", {
        header: "Etapa",
        cell: (info) => info.getValue().name,
      }),
      columnHelper.accessor("categories", {
        header: "Materia",
        cell: (info) => info.getValue().name,
      }),
      
    ];

    return columns;
  };

  const fetchProducts = async () => {
    try {
      const result = await getDataFromTable(
        "products",
        `id,
        name,
        image,
        price,
        description,
        brands (name),
        categories (name)
        `
      );

      if (!result.success) {
        throw result.error;
      }

      const columns = generateColumns();

      setTableData({
        columns: columns,
        data: result.data,
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    tableData,
    fetchProducts,
  };
}