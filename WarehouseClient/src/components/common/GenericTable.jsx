import * as React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import HideSourceIcon from '@mui/icons-material/HideSource';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const GenericTable = ({ columns, rows, loading, onPaginationModelChange, rowCount, page, pageSize, onPageChange, onPageSizeChange, onEdit, onDelete, getRowId, showActions = false, showKardexButton = false }) => {
  const navigate = useNavigate();

  const getActions = (params) => {
    const actions = [];

    if (showActions) {
      actions.push(
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => onEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<HideSourceIcon />}
          label="Make inactive"
          onClick={() => onDelete(params.row)}
        />
      );
    }

    if (showKardexButton) {
      actions.push(
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View Kardex"
          onClick={() => navigate(`/kardex/product/${params.row.product.productId}`)}
        />
      );
    }

    return actions;
  };

  const actionColumn = {
    field: 'actions',
    type: 'actions',
    headerName: 'Acciones',
    flex: 0.2,
    getActions: getActions,
  };

  const finalColumns = showActions || showKardexButton ? [...columns, actionColumn] : columns;

  return (
    <div style={{ height: '650px', width: '100%', flexGrow: 1 }}>
      <DataGrid
        paginationModel={{ page: parseInt(page), pageSize: parseInt(pageSize) }}
        onPaginationModelChange={onPaginationModelChange}
        rows={rows}
        columns={finalColumns}
        pageSize={10}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        page={page}
        pageSizeOptions={[5, 10, 20]}
        paginationMode="server"
        rowCount={rowCount || -1}
        pagination
        getRowHeight={() => 'auto'}
        loading={loading}
        autoHeight
        getRowId={getRowId}
      />
    </div>
  );
};

export default GenericTable;
