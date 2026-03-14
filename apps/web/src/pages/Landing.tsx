import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  HiOutlineBuildingOffice2,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineMapPin,
  HiOutlineShieldCheck,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineBolt,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';

export function Landing() {
  const { t, toggleLanguage, isRtl } = useLanguage();

  const features = [
    { icon: HiOutlineBuildingOffice2, title: t('إدارة شاملة للعقارات', 'Complete Property Management'), desc: t('نظام متكامل لإدارة جميع إعلاناتك العقارية من مكان واحد مع دعم 14+ نوع عقاري سعودي', 'Unified system to manage all your property listings with 14+ Saudi property types') },
    { icon: HiOutlineChartBar, title: t('تقارير وتحليلات ذكية', 'Smart Reports & Analytics'), desc: t('لوحة تحكم متقدمة مع تقارير مفصلة للأداء والمبيعات والعمولات', 'Advanced dashboard with detailed performance, sales, and commission reports') },
    { icon: HiOutlineUsers, title: t('إدارة العملاء (CRM)', 'Contact Management (CRM)'), desc: t('نظام CRM متكامل لإدارة العملاء والعملاء المحتملين وخط الأنابيب', 'Full CRM for managing contacts, leads, and pipeline tracking') },
    { icon: HiOutlineMapPin, title: t('خريطة تفاعلية', 'Interactive Map'), desc: t('استعراض العقارات على خريطة تفاعلية مع فلاتر ذكية للمدن والأحياء', 'Browse properties on interactive map with smart city & district filters') },
    { icon: HiOutlineShieldCheck, title: t('توافق REGA', 'REGA Compliance'), desc: t('ترخيص إعلانات عقارية متوافقة مع هيئة العقار وأنظمة المملكة', 'Ad licensing compliant with REGA and Saudi regulations') },
    { icon: HiOutlineChatBubbleLeftRight, title: t('مطابقة الطلبات', 'Request Matching'), desc: t('محرك مطابقة الطلبات العقارية على نمط ديل أب يربط الطالبين بالوسطاء', 'DealApp-style request matching engine connecting seekers with brokers') },
  ];

  const stats = [
    { number: '14+', label: t('نوع عقاري', 'Property Types') },
    { number: '10+', label: t('مدينة سعودية', 'Saudi Cities') },
    { number: '24/7', label: t('دعم فني', 'Support') },
    { number: '99.9%', label: t('وقت التشغيل', 'Uptime') },
  ];

  return (
    <div className="min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiOutlineBuildingOffice2 className="w-7 h-7 text-holly-600" />
            <span className="text-xl font-bold text-holly-800">عقاركم</span>
            <span className="text-sm text-slate-400 hidden sm:block">Aqarkom</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-slate-600 hover:text-holly-600 transition-colors">{t('المميزات', 'Features')}</a>
            <a href="#stats" className="text-slate-600 hover:text-holly-600 transition-colors">{t('الإحصائيات', 'Stats')}</a>
            <a href="#contact" className="text-slate-600 hover:text-holly-600 transition-colors">{t('تواصل معنا', 'Contact')}</a>
            <Link to="/search" className="text-slate-600 hover:text-holly-600 transition-colors">{t('استعراض العقارات', 'Browse Properties')}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={toggleLanguage} className="text-sm text-slate-500 hover:text-slate-700"><HiOutlineGlobeAlt className="w-4 h-4 inline me-1" />{isRtl ? 'EN' : 'عربي'}</button>
            <Link to="/login" className="text-sm font-medium text-holly-600 hover:text-holly-700">{t('تسجيل الدخول', 'Sign In')}</Link>
            <Link to="/register" className="px-4 py-2 bg-holly-600 text-white text-sm font-medium rounded-lg hover:bg-holly-700 transition-colors">{t('سجل كوسيط', 'Register as Broker')}</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-holly-50 via-white to-holly-50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-holly-100/40 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-holly-100 text-holly-700 text-sm font-semibold rounded-full mb-6">{t('منصة عقارية سعودية متكاملة', 'Complete Saudi Real Estate Platform')}</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              {t('منصة إدارة العقارات', 'Real Estate Management')} <br />
              <span className="text-holly-600">{t('الذكية', 'Platform')}</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('أداة متكاملة لإدارة عملياتك العقارية بكفاءة واحترافية. من إدارة العقارات إلى إتمام الصفقات.', 'A comprehensive tool for managing your real estate operations efficiently. From property management to closing deals.')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-holly-600 text-white font-semibold rounded-xl hover:bg-holly-700 shadow-lg shadow-holly-600/25 transition-all text-lg">
                {t('ابدأ الآن مجاناً', 'Get Started Free')}
                <HiOutlineArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/search" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-holly-300 hover:text-holly-700 transition-all text-lg">
                <HiOutlineMapPin className="w-5 h-5" />
                {t('استعراض العقارات', 'Browse Properties')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="bg-holly-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.number}</p>
                <p className="text-sm text-holly-300 font-medium uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-holly-50 text-holly-600 text-sm font-semibold rounded-full mb-4">{t('مميزات النظام', 'Platform Features')}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t('مميزات منصتنا', 'Our Platform Features')}</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t('أدوات قوية لإدارة عملياتك العقارية بكفاءة', 'Powerful tools for managing your real estate efficiently')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-6 rounded-2xl border border-slate-100 hover:border-holly-200 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-holly-50 text-holly-600 flex items-center justify-center mb-4 group-hover:bg-holly-100 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works - for different user types */}
      <section className="py-20 bg-holly-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('كيف يعمل النظام', 'How It Works')}</h2>
            <p className="text-lg text-slate-500">{t('خطوات بسيطة للبدء حسب دورك', 'Simple steps to get started based on your role')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Customer */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4"><HiOutlineUsers className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('للعملاء', 'For Customers')}</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-holly-500 mt-0.5 flex-shrink-0" />{t('استعراض العقارات على الخريطة', 'Browse properties on the map')}</li>
                <li className="flex items-start gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-holly-500 mt-0.5 flex-shrink-0" />{t('إرسال طلب عقاري', 'Submit a property request')}</li>
                <li className="flex items-start gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-holly-500 mt-0.5 flex-shrink-0" />{t('إرسال قوائم غير موثقة للوسطاء', 'Submit unverified listings for brokers')}</li>
              </ul>
              <Link to="/search" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">{t('استعراض العقارات', 'Browse Now')} <HiOutlineArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
            {/* Broker */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-holly-200 ring-2 ring-holly-100">
              <div className="w-14 h-14 rounded-xl bg-holly-50 text-holly-600 flex items-center justify-center mb-4"><HiOutlineShieldCheck className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('للوسطاء العقاريين', 'For Brokers')}</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-holly-500 mt-0.5 flex-shrink-0" />{t('تقدم بطلب تسجيل كوسيط', 'Apply to register as a broker')}</li>
                <li className="flex items-start gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-holly-500 mt-0.5 flex-shrink-0" />{t('إدارة العقارات والعملاء', 'Manage properties and contacts')}</li>
                <li className="flex items-start gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-holly-500 mt-0.5 flex-shrink-0" />{t('تتبع الصفقات والعمولات', 'Track deals and commissions')}</li>
                <li className="flex items-start gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-holly-500 mt-0.5 flex-shrink-0" />{t('التواصل مع القوائم غير الموثقة', 'Connect with unverified listings')}</li>
              </ul>
              <Link to="/register" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-holly-600 hover:text-holly-700">{t('سجل كوسيط', 'Register Now')} <HiOutlineArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
            {/* Owner */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4"><HiOutlineDocumentText className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('لملاك العقارات', 'For Property Owners')}</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-holly-500 mt-0.5 flex-shrink-0" />{t('أضف عقارك كقائمة غير موثقة', 'Add your property as unverified listing')}</li>
                <li className="flex items-start gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-holly-500 mt-0.5 flex-shrink-0" />{t('وسيط معتمد سيتواصل معك', 'Authorized broker will contact you')}</li>
                <li className="flex items-start gap-2"><HiOutlineCheckCircle className="w-4 h-4 text-holly-500 mt-0.5 flex-shrink-0" />{t('إتمام الصفقة بأمان', 'Complete the deal safely')}</li>
              </ul>
              <Link to="/submit-listing" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700">{t('أضف عقارك', 'Add Property')} <HiOutlineArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('تواصل معنا', 'Contact Us')}</h2>
            <p className="text-lg text-slate-500">{t('فريقنا جاهز للإجابة على استفساراتك', 'Our team is ready to answer your questions')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-holly-50">
              <HiOutlinePhone className="w-8 h-8 text-holly-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800">{t('الهاتف', 'Phone')}</p>
              <p className="text-sm text-slate-500 mt-1" dir="ltr">+966 50 123 4567</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-holly-50">
              <HiOutlineEnvelope className="w-8 h-8 text-holly-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800">{t('البريد', 'Email')}</p>
              <p className="text-sm text-slate-500 mt-1">info@aqarkom.sa</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-holly-50">
              <HiOutlineMapPin className="w-8 h-8 text-holly-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800">{t('العنوان', 'Address')}</p>
              <p className="text-sm text-slate-500 mt-1">{t('الرياض، السعودية', 'Riyadh, Saudi Arabia')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-holly-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineBuildingOffice2 className="w-6 h-6 text-holly-400" />
                <span className="text-lg font-bold text-white">عقاركم</span>
              </div>
              <p className="text-sm text-holly-400 leading-relaxed">{t('منصة عقارية سعودية شاملة لإدارة العقارات والعملاء والصفقات', 'Comprehensive Saudi real estate platform for property, contact, and deal management')}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t('روابط سريعة', 'Quick Links')}</h4>
              <ul className="space-y-2 text-sm text-holly-400">
                <li><Link to="/search" className="hover:text-white transition-colors">{t('استعراض العقارات', 'Browse Properties')}</Link></li>
                <li><Link to="/submit-request" className="hover:text-white transition-colors">{t('طلب عقاري', 'Property Request')}</Link></li>
                <li><Link to="/submit-listing" className="hover:text-white transition-colors">{t('أضف عقارك', 'Submit Listing')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t('للوسطاء', 'For Brokers')}</h4>
              <ul className="space-y-2 text-sm text-holly-400">
                <li><Link to="/register" className="hover:text-white transition-colors">{t('سجل كوسيط', 'Register')}</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">{t('تسجيل الدخول', 'Sign In')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t('تواصل', 'Contact')}</h4>
              <ul className="space-y-2 text-sm text-holly-400">
                <li>info@aqarkom.sa</li>
                <li dir="ltr">+966 50 123 4567</li>
                <li>{t('الرياض، السعودية', 'Riyadh, KSA')}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-holly-800 mt-8 pt-8 text-center text-xs text-holly-500">
            © 2026 عقاركم Aqarkom. {t('جميع الحقوق محفوظة', 'All rights reserved')}.
          </div>
        </div>
      </footer>
    </div>
  );
}
