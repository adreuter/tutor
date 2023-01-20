class W { ...
public: virtual void g(int);
};
class A : public virtual W {...};
class B : public virtual W {
public: virtual void g(int i){ }; int b;
};
class C : public A,public B{...};
C c;
W* pw = &c;
pw->g(42);