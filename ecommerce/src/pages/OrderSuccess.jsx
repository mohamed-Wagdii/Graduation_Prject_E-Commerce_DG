import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function OrderSuccess() {
  const { t } = useContext(AppContext);
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-12 max-w-md w-full">

        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          ✅
        </div>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {t("Order Placed!", "تم تأكيد طلبك!")}
        </h1>
        <p className="text-gray-400 mb-6">
          {t("Your order has been placed successfully. We'll process it shortly.", "تم استلام طلبك بنجاح. سنقوم بمعالجته قريباً.")}
        </p>

        {order && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t("Order ID", "رقم الطلب")}</span>
              <span className="font-mono font-bold text-gray-700 dark:text-white">#{order._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t("Total", "الإجمالي")}</span>
              <span className="font-bold text-blue-600">${order.totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t("Payment", "الدفع")}</span>
              <span className="font-medium text-gray-700 dark:text-white capitalize">{order.paymentMethod?.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t("Status", "الحالة")}</span>
              <span className="font-bold text-yellow-600">⏳ {t("Pending", "قيد الانتظار")}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link to="/app/my-orders"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors">
            {t("Track My Order", "تتبع طلبي")}
          </Link>
          <Link to="/app"
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold transition-colors">
            {t("Continue Shopping", "مواصلة التسوق")}
          </Link>
        </div>
      </div>
    </div>
  );
}
