import React, { useState, useCallback, useMemo } from 'react';
import { DataGrid, GridColDef, GridRowModel, GridRowModes, GridActionsCellItem, GridRowId, GridRowModesModel, GridRowParams } from '@mui/x-data-grid';
import { TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Task } from '../types';
import { toast } from 'react-toastify';

interface TaskTableProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = useCallback((id: GridRowId) => () => {
    setRowModesModel(prevModel => ({ ...prevModel, [id]: { mode: GridRowModes.Edit } }));
  }, []);

  const handleSaveClick = useCallback((id: GridRowId) => () => {
    setRowModesModel(prevModel => ({ ...prevModel, [id]: { mode: GridRowModes.View } }));
  }, []);

  const handleCancelClick = useCallback((id: GridRowId) => () => {
    setRowModesModel(prevModel => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  }, []);

  const processRowUpdate = useCallback((newRow: GridRowModel) => {
    onUpdateTask(newRow as Task);
    toast.success('Task updated successfully!');
    return newRow;
  }, [onUpdateTask]);

  const filteredTasks = useMemo(() => tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  ), [tasks, searchTerm]);

  const columns: GridColDef[] = useMemo(() => [
    // { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 200, editable: true },
    { field: 'description', headerName: 'Description', width: 300, editable: true },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['To Do', 'In Progress', 'Done'],
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }: GridRowParams) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => {
              onDeleteTask(Number(id));
              toast.success('Task deleted successfully!');
            }}
            color="inherit"
          />,
        ];
      },
    },
  ], [rowModesModel, handleSaveClick, handleCancelClick, handleEditClick, onDeleteTask]);

  return (
    <div className="h-[500px] w-full">
      <TextField
        label="Search tasks"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <DataGrid
        rows={filteredTasks}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStop={(params, event) => {
          if (params.reason === 'rowFocusOut') {
            event.defaultMuiPrevented = true;
          }
        }}
        processRowUpdate={processRowUpdate}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        disableColumnMenu
        disableDensitySelector
      />
    </div>
  );
};

export default TaskTable;

