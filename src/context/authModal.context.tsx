import {
  FC,
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";
import { Modal } from "flowbite";
import Button from "../components/shared/buttons/button";
import { Col } from "../components/shared/layout/flex";
import Login from "../components/app/login/login";
import Signup from "../components/app/signup/signup";
import CloseIcon from "../components/svg/Shared/CloseIcon";

export const AuthModal = createContext({
  modalTrigger: { show: () => null, hide: () => null },
  setVisibleSection: (x: string) => null,
  hideModal: () => null,
  setNavigateTo: (x: { route: string, queryParam: string }) => null,
});

const AuthModalProvider: FC<any> = (props: any) => {
  const [modalTrigger, setModalTrigger] = useState<any>();
  const [visibleSection, setVisibleSection] = useState<"login" | "signup">(
    "login"
  );
  const [navigateTo, setNavigateTo] = useState<{ route: string, queryParam: string }>();

  useEffect(() => {
    const $targetEl = document.getElementById("authentication-modal");

    const options: any = {
      placement: "center",
      backdrop: "static",
      closable: true,
      backdropClasses: "bg-white absolute top-0 right-0 left-0 bottom-0 z-50 opacity-30"
    };
    const modal = new Modal($targetEl, options);
    setModalTrigger(modal);
  }, []);
  const hideModal = useCallback(() => modalTrigger.hide(), [modalTrigger]);

  const contextValue: any = { modalTrigger, setVisibleSection, hideModal, setNavigateTo };

  return (
    <AuthModal.Provider value={contextValue}>
      <Col
        id="authentication-modal"
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-[100] hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <Col className="relative bg-black-2 p-5 w-full max-h-full rounded-lg shadow max-w-md">
          <Col className="gap-4 min-h-[450px]">
            <Button
              className="bg-transparent rounded-lg p-1.5 hover:bg-grey-7 ml-auto"
              onClick={() => modalTrigger.hide()}>
              <CloseIcon className='stroke-current text-[#89939F] w-3 h-3' />
            </Button>
            {visibleSection === "login" ? (
              <Login changeSection={setVisibleSection} isModal={true} />
            ) : (
              <Signup changeSection={setVisibleSection} isModal={true} navigateTo={navigateTo} />
            )}
          </Col>
        </Col>
      </Col>
      {props.children}
    </AuthModal.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModal);

export default AuthModalProvider;
