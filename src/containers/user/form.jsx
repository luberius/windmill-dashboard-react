import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  HelperText,
  Input,
  Label,
  Select
} from '@luberius/fork-windmill-react-ui';
import { toast } from 'react-hot-toast';
import { useHistory } from 'react-router-dom';
import http from '../../utils/axios/axios';
import { showSuccessNotification } from '../../utils/notification';

function UserForm(props) {
  const { id, edit } = props;
  const history = useHistory();

  const [error, setError] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = () => {
    http.get();
  };

  const validate = () => {
    const theError = {};
    setError(theError);
    theError.error = false;

    if (!username) {
      theError.username = 'Username wajib diisi';
      theError.error = true;
    }

    if (!password) {
      theError.password = 'Password wajib diisi';
      theError.error = true;
    }

    if (!confirmPassword) {
      theError.confirmPassword = 'Confirm Password wajib diisi';
      theError.error = true;
    }

    if (confirmPassword && password !== confirmPassword) {
      theError.confirmPassword = 'Password tidak sama';
      theError.error = true;
    }

    setError(theError);
    return theError.error;
  };

  const doSave = () => {
    if (validate()) return;
    const endpoint = edit ? 'update' : 'register';
    const caption = edit ? 'simpan' : 'buat';
    const toastId = toast.loading('Menyimpan..');

    setIsLoading(true);
    http
      .post(endpoint, { username, password, role })
      .then((r) => {
        console.log(r.data);
        setIsLoading(false);
        toast.remove(toastId);
        showSuccessNotification(`User berhasil di ${caption}`);
        history.push('/app/users');
      })
      .catch((e) => {
        setIsLoading(false);
        toast.remove(toastId);
        toast.error(e.response.data.message || e.message);
      });
  };

  useEffect(() => {
    if (edit) fetchUser();
  }, []);

  return (
    <Card className="lg:w-1/2">
      <CardBody className="p-6">
        <Label>
          <span>Username</span>
          <Input
            className="mt-2"
            type="text"
            placeholder="Username"
            value={username}
            onChange={({ target: e }) => setUsername(e.value)}
          />
          {error.username && <HelperText valid={false}>{error.username}</HelperText>}
        </Label>
        <Label className="mt-4">
          <span>Password</span>
          <Input
            className="mt-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={({ target: e }) => setPassword(e.value)}
          />
          {error.password && <HelperText valid={false}>{error.password}</HelperText>}
        </Label>
        <Label className="mt-4">
          <span>Confirm Password</span>
          <Input
            className="mt-2"
            type="password"
            placeholder="Confirm Passowrd"
            value={confirmPassword}
            onChange={({ target: e }) => setConfirmPassword(e.value)}
          />
          {error.confirmPassword && <HelperText valid={false}>{error.confirmPassword}</HelperText>}
        </Label>
        <Label className="mt-4">
          <span>Role</span>
          <Select className="mt-1" value={role} onChange={({ target: e }) => setRole(e.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Select>
        </Label>

        <div className="flex justify-end mt-6">
          <Button onClick={doSave} disabled={isLoading}>
            {edit ? 'Save' : 'Create'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default UserForm;
